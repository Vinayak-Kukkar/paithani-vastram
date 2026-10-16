import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Saree from '../models/Saree.js';
import Order from '../models/Order.js';
import { seedSarees } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

// Helper to check if mongoose is connected
export const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// File-based store fallback
function readLocalDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { sarees: seedSarees, orders: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading local db.json:', err);
    return { sarees: seedSarees, orders: [] };
  }
}

function writeLocalDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local db.json:', err);
  }
}

export const DataStore = {
  // SAREES
  async getSarees(filter = {}) {
    if (isMongoConnected()) {
      try {
        const query = {};
        if (filter.category && filter.category !== 'All') {
          query.category = filter.category;
        }
        if (filter.color && filter.color !== 'All') {
          query.color = new RegExp(filter.color, 'i');
        }
        if (filter.search) {
          const s = filter.search;
          query.$or = [
            { name: new RegExp(s, 'i') },
            { marathiName: new RegExp(s, 'i') },
            { description: new RegExp(s, 'i') },
            { palluMotif: new RegExp(s, 'i') },
            { color: new RegExp(s, 'i') }
          ];
        }
        if (filter.minPrice || filter.maxPrice) {
          query.price = {};
          if (filter.minPrice) query.price.$gte = Number(filter.minPrice);
          if (filter.maxPrice) query.price.$lte = Number(filter.maxPrice);
        }
        if (filter.personalOnly === 'true') {
          query.isPersonalCollection = true;
        }

        let q = Saree.find(query);
        if (filter.sort === 'price-low') q = q.sort({ price: 1 });
        else if (filter.sort === 'price-high') q = q.sort({ price: -1 });
        else if (filter.sort === 'rating') q = q.sort({ rating: -1 });
        else q = q.sort({ createdAt: -1 });

        const results = await q.exec();
        if (results && results.length > 0) return results;
      } catch (err) {
        console.warn('MongoDB query failed, falling back to local store:', err.message);
      }
    }

    // Local JSON store fallback
    const db = readLocalDb();
    let list = [...db.sarees];

    if (filter.category && filter.category !== 'All') {
      list = list.filter(s => s.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.color && filter.color !== 'All') {
      list = list.filter(s => s.color.toLowerCase().includes(filter.color.toLowerCase()));
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(item => 
        (item.name && item.name.toLowerCase().includes(s)) ||
        (item.marathiName && item.marathiName.toLowerCase().includes(s)) ||
        (item.description && item.description.toLowerCase().includes(s)) ||
        (item.palluMotif && item.palluMotif.toLowerCase().includes(s)) ||
        (item.color && item.color.toLowerCase().includes(s))
      );
    }
    if (filter.minPrice) {
      list = list.filter(s => s.price >= Number(filter.minPrice));
    }
    if (filter.maxPrice) {
      list = list.filter(s => s.price <= Number(filter.maxPrice));
    }
    if (filter.personalOnly === 'true') {
      list = list.filter(s => s.isPersonalCollection);
    }

    if (filter.sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (filter.sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (filter.sort === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  },

  async getSareeById(id) {
    if (isMongoConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const s = await Saree.findById(id);
          if (s) return s;
        }
        const sByCustomId = await Saree.findOne({ id });
        if (sByCustomId) return sByCustomId;
      } catch (err) {
        console.warn('MongoDB getById fallback:', err.message);
      }
    }

    const db = readLocalDb();
    return db.sarees.find(s => s.id === id || s._id === id);
  },

  async createSaree(sareeData) {
    const newId = `pv-${Date.now().toString().slice(-6)}`;
    const fullData = {
      id: newId,
      createdAt: new Date().toISOString(),
      inStock: true,
      rating: 4.9,
      reviewsCount: 1,
      silkMarkCertified: true,
      handloom: true,
      isPersonalCollection: true,
      ...sareeData
    };

    if (isMongoConnected()) {
      try {
        const created = await Saree.create(fullData);
        // Also save to local db for redundancy
        const db = readLocalDb();
        db.sarees.unshift(created.toObject());
        writeLocalDb(db);
        return created;
      } catch (err) {
        console.warn('MongoDB create failed, saving to local store:', err.message);
      }
    }

    const db = readLocalDb();
    fullData._id = newId;
    db.sarees.unshift(fullData);
    writeLocalDb(db);
    return fullData;
  },

  async deleteSaree(id) {
    if (isMongoConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          await Saree.findByIdAndDelete(id);
        } else {
          await Saree.findOneAndDelete({ id });
        }
      } catch (err) {
        console.warn('MongoDB delete failed:', err.message);
      }
    }

    const db = readLocalDb();
    db.sarees = db.sarees.filter(s => s.id !== id && s._id !== id);
    writeLocalDb(db);
    return true;
  },

  // ORDERS
  async createOrder(orderData) {
    const orderNumber = `PV-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      ...orderData
    };

    if (isMongoConnected()) {
      try {
        const created = await Order.create(newOrder);
        const db = readLocalDb();
        db.orders.unshift(created.toObject());
        writeLocalDb(db);
        return created;
      } catch (err) {
        console.warn('MongoDB order creation failed, fallback to local:', err.message);
      }
    }

    const db = readLocalDb();
    newOrder._id = orderNumber;
    db.orders.unshift(newOrder);
    writeLocalDb(db);
    return newOrder;
  },

  async getOrders() {
    if (isMongoConnected()) {
      try {
        const list = await Order.find().sort({ createdAt: -1 });
        if (list && list.length > 0) return list;
      } catch (err) {
        console.warn('MongoDB getOrders failed:', err.message);
      }
    }
    const db = readLocalDb();
    return db.orders || [];
  },

  async updateSaree(id, updateData) {
    if (isMongoConnected()) {
      try {
        let updated;
        if (mongoose.Types.ObjectId.isValid(id)) {
          updated = await Saree.findByIdAndUpdate(id, updateData, { new: true });
        }
        if (!updated) {
          updated = await Saree.findOneAndUpdate({ id }, updateData, { new: true });
        }
        if (updated) {
          const db = readLocalDb();
          const idx = db.sarees.findIndex(s => s.id === id || s._id === id);
          if (idx !== -1) {
            db.sarees[idx] = { ...db.sarees[idx], ...updated.toObject() };
            writeLocalDb(db);
          }
          return updated;
        }
      } catch (err) {
        console.warn('MongoDB updateSaree failed:', err.message);
      }
    }

    const db = readLocalDb();
    const idx = db.sarees.findIndex(s => s.id === id || s._id === id);
    if (idx !== -1) {
      db.sarees[idx] = { ...db.sarees[idx], ...updateData };
      writeLocalDb(db);
      return db.sarees[idx];
    }
    return null;
  },

  async updateOrderStatus(id, status) {
    if (isMongoConnected()) {
      try {
        let updated;
        if (mongoose.Types.ObjectId.isValid(id)) {
          updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
        }
        if (!updated) {
          updated = await Order.findOneAndUpdate({ orderNumber: id }, { status }, { new: true });
        }
        if (updated) {
          const db = readLocalDb();
          const idx = db.orders.findIndex(o => o.orderNumber === id || o._id === id);
          if (idx !== -1) {
            db.orders[idx].status = status;
            writeLocalDb(db);
          }
          return updated;
        }
      } catch (err) {
        console.warn('MongoDB updateOrderStatus failed:', err.message);
      }
    }

    const db = readLocalDb();
    const idx = db.orders.findIndex(o => o.orderNumber === id || o._id === id);
    if (idx !== -1) {
      db.orders[idx].status = status;
      writeLocalDb(db);
      return db.orders[idx];
    }
    return null;
  }
};
