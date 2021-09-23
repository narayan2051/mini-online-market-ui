/* eslint-disable no-console */
export const SessionStorage = {
  setItem(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error writing to sessionStorage`, key, value);
    }
  },
  getItem(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (err) {
      console.error(`Error getting from sessionStorage`, key);
      return undefined;
    }
  },
  removeItem(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing item from sessionStorage`, key);
    }
  },
  clear() {
    try {
      sessionStorage.clear();
    } catch (err) {
      console.error('Error clearing sessionStorage');
    }
  },
};