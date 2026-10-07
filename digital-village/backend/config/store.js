import mongoose from 'mongoose';
import {
  initialVillageData,
  initialFacilities,
  initialProjects,
  initialEvents,
  initialGallery,
  initialPlaces,
  initialHeroes,
  initialNews,
  initialContacts,
  initialSuggestions,
  initialCulture,
} from './initialData.js';

// Import Mongoose models
import VillageModel from '../models/Village.js';
import FacilityModel from '../models/Facility.js';
import ProjectModel from '../models/Project.js';
import EventModel from '../models/Event.js';
import GalleryModel from '../models/Gallery.js';
import ContactModel from '../models/Contact.js';
import NewsModel from '../models/News.js';
import SuggestionModel from '../models/Suggestion.js';

// In-Memory store initialized with complete default seed data
const inMemory = {
  village: { ...initialVillageData },
  facilities: [...initialFacilities],
  projects: [...initialProjects],
  events: [...initialEvents],
  gallery: [...initialGallery],
  places: [...initialPlaces],
  heroes: [...initialHeroes],
  news: [...initialNews],
  contacts: [...initialContacts],
  suggestions: [...initialSuggestions],
  culture: [...initialCulture],
};

const isMongooseReady = () => mongoose.connection.readyState === 1;

export const dataStore = {
  // Village Info
  async getVillage() {
    if (isMongooseReady()) {
      try {
        let v = await VillageModel.findOne();
        if (!v) {
          v = await VillageModel.create(inMemory.village);
        }
        return v;
      } catch (err) {
        console.warn('Mongoose fetch fallback:', err.message);
      }
    }
    return inMemory.village;
  },

  async updateVillage(updateData) {
    if (isMongooseReady()) {
      try {
        const v = await VillageModel.findOneAndUpdate({}, updateData, { new: true, upsert: true });
        return v;
      } catch (err) {
        console.warn('Mongoose update fallback:', err.message);
      }
    }
    inMemory.village = { ...inMemory.village, ...updateData };
    return inMemory.village;
  },

  // Facilities
  async getFacilities() {
    if (isMongooseReady()) {
      try {
        const docs = await FacilityModel.find().sort({ order: 1 });
        if (docs.length > 0) return docs;
        // Seed if empty
        await FacilityModel.insertMany(inMemory.facilities);
        return await FacilityModel.find().sort({ order: 1 });
      } catch (err) {
        console.warn('Mongoose facilities fallback:', err.message);
      }
    }
    return [...inMemory.facilities].sort((a, b) => a.order - b.order);
  },

  async addFacility(item) {
    const newItem = {
      id: `fac-${Date.now()}`,
      order: item.order || inMemory.facilities.length + 1,
      title: item.title,
      icon: item.icon || 'fa-solid fa-star',
      category: item.category || 'Essential',
      description: item.description,
      details: item.details || '',
      isAvailable: item.isAvailable !== false,
      timings: item.timings || 'Daily',
      createdAt: new Date().toISOString(),
    };

    if (isMongooseReady()) {
      try {
        const doc = await FacilityModel.create(newItem);
        return doc;
      } catch (err) {
        console.warn('Mongoose add facility fallback:', err.message);
      }
    }
    inMemory.facilities.push(newItem);
    return newItem;
  },

  async updateFacility(id, updateData) {
    if (isMongooseReady()) {
      try {
        const doc = await FacilityModel.findOneAndUpdate(
          { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { id }] },
          updateData,
          { new: true }
        );
        if (doc) return doc;
      } catch (err) {
        console.warn('Mongoose update facility fallback:', err.message);
      }
    }
    const idx = inMemory.facilities.findIndex((f) => f.id === id || String(f._id) === id);
    if (idx !== -1) {
      inMemory.facilities[idx] = { ...inMemory.facilities[idx], ...updateData };
      return inMemory.facilities[idx];
    }
    return null;
  },

  async deleteFacility(id) {
    if (isMongooseReady()) {
      try {
        await FacilityModel.findOneAndDelete({
          $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { id }],
        });
      } catch (err) {
        console.warn('Mongoose delete facility fallback:', err.message);
      }
    }
    const idx = inMemory.facilities.findIndex((f) => f.id === id || String(f._id) === id);
    if (idx !== -1) {
      const removed = inMemory.facilities.splice(idx, 1);
      return removed[0];
    }
    return null;
  },

  // Projects
  async getProjects() {
    if (isMongooseReady()) {
      try {
        const docs = await ProjectModel.find();
        if (docs.length > 0) return docs;
        await ProjectModel.insertMany(inMemory.projects);
        return await ProjectModel.find();
      } catch (err) {
        console.warn('Mongoose projects fallback:', err.message);
      }
    }
    return inMemory.projects;
  },

  async addProject(item) {
    const newItem = {
      id: `proj-${Date.now()}`,
      title: item.title,
      code: item.code || 'GP-2026',
      description: item.description,
      status: item.status || 'In Progress',
      progress: Number(item.progress) || 0,
      budget: item.budget || '₹10 Lakhs',
      completionDate: item.completionDate || '2026',
      beneficiaries: item.beneficiaries || 'Village Residents',
      icon: item.icon || 'fa-solid fa-list-check',
      createdAt: new Date().toISOString(),
    };

    if (isMongooseReady()) {
      try {
        return await ProjectModel.create(newItem);
      } catch (err) {
        console.warn('Mongoose add project fallback:', err.message);
      }
    }
    inMemory.projects.push(newItem);
    return newItem;
  },

  async updateProject(id, updateData) {
    if (isMongooseReady()) {
      try {
        const doc = await ProjectModel.findOneAndUpdate(
          { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { id }] },
          updateData,
          { new: true }
        );
        if (doc) return doc;
      } catch (err) {
        console.warn('Mongoose update project fallback:', err.message);
      }
    }
    const idx = inMemory.projects.findIndex((p) => p.id === id || String(p._id) === id);
    if (idx !== -1) {
      inMemory.projects[idx] = { ...inMemory.projects[idx], ...updateData };
      return inMemory.projects[idx];
    }
    return null;
  },

  // Events
  async getEvents() {
    if (isMongooseReady()) {
      try {
        const docs = await EventModel.find().sort({ date: 1 });
        if (docs.length > 0) return docs;
        await EventModel.insertMany(inMemory.events);
        return await EventModel.find().sort({ date: 1 });
      } catch (err) {
        console.warn('Mongoose events fallback:', err.message);
      }
    }
    return inMemory.events;
  },

  async addEvent(item) {
    const newItem = {
      id: `evt-${Date.now()}`,
      title: item.title,
      date: item.date,
      displayDate: item.displayDate || new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      location: item.location,
      description: item.description,
      organizer: item.organizer || 'Gram Panchayat',
      category: item.category || 'General',
      icon: item.icon || 'fa-solid fa-calendar-check',
      createdAt: new Date().toISOString(),
    };

    if (isMongooseReady()) {
      try {
        return await EventModel.create(newItem);
      } catch (err) {
        console.warn('Mongoose add event fallback:', err.message);
      }
    }
    inMemory.events.push(newItem);
    return newItem;
  },

  async updateEvent(id, updateData) {
    if (isMongooseReady()) {
      try {
        const doc = await EventModel.findOneAndUpdate(
          { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { id }] },
          updateData,
          { new: true }
        );
        if (doc) return doc;
      } catch (err) {
        console.warn('Mongoose update event fallback:', err.message);
      }
    }
    const idx = inMemory.events.findIndex((e) => e.id === id || String(e._id) === id);
    if (idx !== -1) {
      inMemory.events[idx] = { ...inMemory.events[idx], ...updateData };
      return inMemory.events[idx];
    }
    return null;
  },

  async deleteEvent(id) {
    if (isMongooseReady()) {
      try {
        await EventModel.findOneAndDelete({
          $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { id }],
        });
      } catch (err) {
        console.warn('Mongoose delete event fallback:', err.message);
      }
    }
    const idx = inMemory.events.findIndex((e) => e.id === id || String(e._id) === id);
    if (idx !== -1) {
      return inMemory.events.splice(idx, 1)[0];
    }
    return null;
  },

  // Gallery
  async getGallery(category) {
    if (isMongooseReady()) {
      try {
        const query = category && category !== 'All' ? { category } : {};
        const docs = await GalleryModel.find(query);
        if (docs.length > 0) return docs;
        await GalleryModel.insertMany(inMemory.gallery);
        return await GalleryModel.find(query);
      } catch (err) {
        console.warn('Mongoose gallery fallback:', err.message);
      }
    }
    if (category && category !== 'All') {
      return inMemory.gallery.filter((g) => g.category.toLowerCase() === category.toLowerCase());
    }
    return inMemory.gallery;
  },

  async addGalleryItem(item) {
    const newItem = {
      id: `gal-${Date.now()}`,
      title: item.title,
      category: item.category || 'Nature',
      caption: item.caption || item.title,
      tags: Array.isArray(item.tags) ? item.tags : [item.category || 'Village'],
      color: item.color || '#2e7d32',
      icon: item.icon || 'fa-solid fa-image',
      imageUrl: item.imageUrl || '',
      createdAt: new Date().toISOString(),
    };

    if (isMongooseReady()) {
      try {
        return await GalleryModel.create(newItem);
      } catch (err) {
        console.warn('Mongoose add gallery fallback:', err.message);
      }
    }
    inMemory.gallery.push(newItem);
    return newItem;
  },

  async deleteGalleryItem(id) {
    if (isMongooseReady()) {
      try {
        await GalleryModel.findOneAndDelete({
          $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { id }],
        });
      } catch (err) {
        console.warn('Mongoose delete gallery fallback:', err.message);
      }
    }
    const idx = inMemory.gallery.findIndex((g) => g.id === id || String(g._id) === id);
    if (idx !== -1) {
      return inMemory.gallery.splice(idx, 1)[0];
    }
    return null;
  },

  // Places, Heroes, Culture
  async getPlaces() {
    return inMemory.places;
  },
  async getHeroes() {
    return inMemory.heroes;
  },
  async getCulture() {
    return inMemory.culture;
  },

  // News
  async getNews() {
    if (isMongooseReady()) {
      try {
        const docs = await NewsModel.find().sort({ isPinned: -1, createdAt: -1 });
        if (docs.length > 0) return docs;
        await NewsModel.insertMany(inMemory.news);
        return await NewsModel.find().sort({ isPinned: -1, createdAt: -1 });
      } catch (err) {
        console.warn('Mongoose news fallback:', err.message);
      }
    }
    return inMemory.news;
  },

  async addNews(item) {
    const newItem = {
      id: `news-${Date.now()}`,
      title: item.title,
      category: item.category || 'Village News',
      date: item.date || new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
      summary: item.summary,
      details: item.details || '',
      isPinned: Boolean(item.isPinned),
      createdAt: new Date().toISOString(),
    };

    if (isMongooseReady()) {
      try {
        return await NewsModel.create(newItem);
      } catch (err) {
        console.warn('Mongoose add news fallback:', err.message);
      }
    }
    inMemory.news.unshift(newItem);
    return newItem;
  },

  async deleteNews(id) {
    if (isMongooseReady()) {
      try {
        await NewsModel.findOneAndDelete({
          $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { id }],
        });
      } catch (err) {
        console.warn('Mongoose delete news fallback:', err.message);
      }
    }
    const idx = inMemory.news.findIndex((n) => n.id === id || String(n._id) === id);
    if (idx !== -1) {
      return inMemory.news.splice(idx, 1)[0];
    }
    return null;
  },

  // Contacts
  async getContacts() {
    if (isMongooseReady()) {
      try {
        const docs = await ContactModel.find().sort({ createdAt: -1 });
        if (docs.length > 0) return docs;
      } catch (err) {
        console.warn('Mongoose contacts fallback:', err.message);
      }
    }
    return inMemory.contacts;
  },

  async addContact(data) {
    const newContact = {
      id: `cnt-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject || 'General Inquiry',
      message: data.message,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    if (isMongooseReady()) {
      try {
        return await ContactModel.create(newContact);
      } catch (err) {
        console.warn('Mongoose save contact fallback:', err.message);
      }
    }
    inMemory.contacts.unshift(newContact);
    return newContact;
  },

  // Suggestions
  async getSuggestions() {
    if (isMongooseReady()) {
      try {
        const docs = await SuggestionModel.find().sort({ createdAt: -1 });
        if (docs.length > 0) return docs;
      } catch (err) {
        console.warn('Mongoose suggestions fallback:', err.message);
      }
    }
    return inMemory.suggestions;
  },

  async addSuggestion(data) {
    const newSug = {
      id: `sug-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      category: data.category || 'Village Development',
      message: data.message,
      upvotes: 0,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    if (isMongooseReady()) {
      try {
        return await SuggestionModel.create(newSug);
      } catch (err) {
        console.warn('Mongoose save suggestion fallback:', err.message);
      }
    }
    inMemory.suggestions.unshift(newSug);
    return newSug;
  },
};

export default dataStore;
