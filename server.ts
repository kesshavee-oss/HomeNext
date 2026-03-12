import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("homenest.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    city_id INTEGER,
    locality TEXT,
    price INTEGER,
    type TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area INTEGER,
    amenities TEXT,
    image TEXT,
    description TEXT,
    FOREIGN KEY (city_id) REFERENCES cities(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS saved_properties (
    user_id INTEGER,
    property_id INTEGER,
    PRIMARY KEY (user_id, property_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
  );

  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    property_id INTEGER,
    visit_date TEXT,
    visit_time TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
  );

  CREATE TABLE IF NOT EXISTS contact_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    property_id INTEGER,
    name TEXT,
    email TEXT,
    mobile TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
  );
`);

// Seed Data if empty
const cityCount = db.prepare("SELECT COUNT(*) as count FROM cities").get() as { count: number };
if (cityCount.count === 0) {
  const cities = [
    "Surat", "Mumbai", "Delhi", "Bangalore", "Ahmedabad", "Pune", "Hyderabad", "Chennai", "Kolkata", "Jaipur",
    "Chandigarh", "Indore", "Bhopal", "Lucknow", "Kanpur", "Nagpur", "Kochi", "Coimbatore", "Visakhapatnam", "Vadodara"
  ];

  const insertCity = db.prepare("INSERT INTO cities (name, image) VALUES (?, ?)");
  const insertProperty = db.prepare(`
    INSERT INTO properties (name, city_id, locality, price, type, bedrooms, bathrooms, area, amenities, image, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  cities.forEach((cityName, index) => {
    const cityImage = `https://picsum.photos/seed/${cityName}/800/600`;
    insertCity.run(cityName, cityImage);
    const cityId = index + 1;

    const types = ["Apartment", "Villa", "Independent House", "Builder Floor", "Plot"];
    const localities = ["Central", "North", "South", "East", "West", "Suburb", "Downtown", "Green Valley", "Skyline", "Riverside"];
    const amenitiesList = ["Parking", "Garden", "Gym", "Swimming Pool", "Security"];

    types.forEach(type => {
      for (let i = 1; i <= 10; i++) {
        const locality = localities[Math.floor(Math.random() * localities.length)];
        const price = Math.floor(Math.random() * (15000000 - 2000000) + 2000000);
        const bedrooms = type === "Plot" ? 0 : Math.floor(Math.random() * 4) + 1;
        const bathrooms = type === "Plot" ? 0 : Math.max(1, bedrooms - (Math.random() > 0.5 ? 1 : 0));
        const area = Math.floor(Math.random() * (3000 - 500) + 500);
        const selectedAmenities = amenitiesList.filter(() => Math.random() > 0.5).join(", ");
        const propertyImage = `https://picsum.photos/seed/${cityName}-${type}-${i}/800/600`;
        const name = `${bedrooms > 0 ? bedrooms + ' BHK ' : ''}${type} in ${locality}`;

        insertProperty.run(
          name,
          cityId,
          locality,
          price,
          type,
          bedrooms,
          bathrooms,
          area,
          selectedAmenities,
          propertyImage,
          `Beautiful ${type} located in the heart of ${locality}, ${cityName}. Perfect for families looking for a mid-budget home.`
        );
      }
    });
  });

  // Add a default admin
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Admin", "admin@homenest.in", "admin123", "admin"
  );
  // Add a default user
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "John Doe", "john@example.com", "password123", "user"
  );
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/cities", (req, res) => {
    const cities = db.prepare("SELECT * FROM cities").all();
    res.json(cities);
  });

  app.get("/api/properties", (req, res) => {
    const { city, type, minPrice, maxPrice, bedrooms, amenities } = req.query;
    let query = "SELECT p.*, c.name as city_name FROM properties p JOIN cities c ON p.city_id = c.id WHERE 1=1";
    const params: any[] = [];

    if (city) {
      query += " AND c.name = ?";
      params.push(city);
    }
    if (type) {
      query += " AND p.type = ?";
      params.push(type);
    }
    if (minPrice) {
      query += " AND p.price >= ?";
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += " AND p.price <= ?";
      params.push(Number(maxPrice));
    }
    if (bedrooms) {
      query += " AND p.bedrooms = ?";
      params.push(Number(bedrooms));
    }
    if (amenities) {
      const amenitiesArr = (amenities as string).split(",");
      amenitiesArr.forEach(amenity => {
        query += " AND p.amenities LIKE ?";
        params.push(`%${amenity}%`);
      });
    }

    const properties = db.prepare(query).all(...params);
    res.json(properties);
  });

  app.get("/api/properties/:id", (req, res) => {
    const property = db.prepare("SELECT p.*, c.name as city_name FROM properties p JOIN cities c ON p.city_id = c.id WHERE p.id = ?").get(req.params.id);
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ error: "Property not found" });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT id, name, email, role FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;
    try {
      const result = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, password);
      res.json({ id: result.lastInsertRowid, name, email, role: 'user' });
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.get("/api/user/:id/saved", (req, res) => {
    const saved = db.prepare(`
      SELECT p.*, c.name as city_name 
      FROM properties p 
      JOIN cities c ON p.city_id = c.id 
      JOIN saved_properties sp ON p.id = sp.property_id 
      WHERE sp.user_id = ?
    `).all(req.params.id);
    res.json(saved);
  });

  app.post("/api/user/save", (req, res) => {
    const { userId, propertyId } = req.body;
    try {
      db.prepare("INSERT INTO saved_properties (user_id, property_id) VALUES (?, ?)").run(userId, propertyId);
      res.json({ success: true });
    } catch (e) {
      db.prepare("DELETE FROM saved_properties WHERE user_id = ? AND property_id = ?").run(userId, propertyId);
      res.json({ success: true, removed: true });
    }
  });

  app.post("/api/visits", (req, res) => {
    const { userId, propertyId, date, time, message } = req.body;
    db.prepare("INSERT INTO visits (user_id, property_id, visit_date, visit_time, message) VALUES (?, ?, ?, ?, ?)").run(
      userId, propertyId, date, time, message
    );
    res.json({ success: true });
  });

  app.post("/api/contact", (req, res) => {
    const { userId, propertyId, name, email, mobile, message } = req.body;
    db.prepare("INSERT INTO contact_requests (user_id, property_id, name, email, mobile, message) VALUES (?, ?, ?, ?, ?, ?)").run(
      userId || null, propertyId, name, email, mobile, message
    );
    res.json({ success: true });
  });

  // Admin Routes
  app.get("/api/admin/stats", (req, res) => {
    const cities = db.prepare("SELECT COUNT(*) as count FROM cities").get() as any;
    const properties = db.prepare("SELECT COUNT(*) as count FROM properties").get() as any;
    const users = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
    const visits = db.prepare("SELECT COUNT(*) as count FROM visits").get() as any;
    const contacts = db.prepare("SELECT COUNT(*) as count FROM contact_requests").get() as any;
    res.json({
      cities: cities.count,
      properties: properties.count,
      users: users.count,
      visits: visits.count,
      contacts: contacts.count
    });
  });

  app.get("/api/admin/visits", (req, res) => {
    const visits = db.prepare(`
      SELECT v.*, u.name as user_name, p.name as property_name 
      FROM visits v 
      JOIN users u ON v.user_id = u.id 
      JOIN properties p ON v.property_id = p.id
    `).all();
    res.json(visits);
  });

  app.post("/api/admin/visits/:id/status", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE visits SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/admin/contacts", (req, res) => {
    const contacts = db.prepare(`
      SELECT cr.*, p.name as property_name 
      FROM contact_requests cr 
      JOIN properties p ON cr.property_id = p.id
    `).all();
    res.json(contacts);
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
