/* eslint-disable no-console */
export const LocalStorage = {
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error writing to localStorage`, key, value);
    }
  },
  getItem(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (err) {
      console.error(`Error getting from localStorage`, key);
      return undefined;
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing item from localStorage`, key);
    }
  },
  clear() {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('Error clearing localStorage');
    }
  },
};