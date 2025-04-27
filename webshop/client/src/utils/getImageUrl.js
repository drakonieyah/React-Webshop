const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}