
const PREFIX = "lms-admin-portal";

export function loadData(key, fallback = []) {
  try {
    const saved = localStorage.getItem(`${PREFIX}-${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function saveData(key, value) {
  localStorage.setItem(`${PREFIX}-${key}`, JSON.stringify(value));
}
