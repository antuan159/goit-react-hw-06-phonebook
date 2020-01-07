const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return null;
  } catch (err) {
    return null;
  }
};

const get = key => {
  try {
    const contacts = localStorage.getItem(key);
    return contacts ? JSON.parse(contacts) : null;
  } catch (err) {
    return null;
  }
};

export default {
  set,
  get,
};
