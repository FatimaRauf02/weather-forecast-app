import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const client = axios.create({ baseURL: BASE_URL, timeout: 12000 });

// Pulls a clean error message out of a failed request, falling back to a generic one.
function extractError(err) {
  if (err.response?.data?.error) {
    return { message: err.response.data.error, suggestion: err.response.data.suggestion };
  }
  if (err.code === 'ECONNABORTED') {
    return { message: 'The request took too long. Please check your connection and try again.' };
  }
  if (!err.response) {
    return { message: 'Could not reach the server. Check your internet connection.' };
  }
  return { message: 'Something went wrong. Please try again.' };
}

export const weatherApi = {
  search: async (query) => {
    try {
      const { data } = await client.get('/weather/search', { params: { q: query } });
      return data;
    } catch (err) {
      throw extractError(err);
    }
  },

  reverseGeocode: async (lat, lon) => {
    try {
      const { data } = await client.get('/weather/reverse', { params: { lat, lon } });
      return data;
    } catch (err) {
      throw extractError(err);
    }
  },

  getCurrent: async (lat, lon, unit) => {
    try {
      const { data } = await client.get('/weather/current', { params: { lat, lon, unit } });
      return data;
    } catch (err) {
      throw extractError(err);
    }
  },
};

export const tripsApi = {
  list: async (sort = 'newest') => {
    try {
      const { data } = await client.get('/trips', { params: { sort } });
      return data;
    } catch (err) {
      throw extractError(err);
    }
  },

  create: async (payload) => {
    try {
      const { data } = await client.post('/trips', payload);
      return data;
    } catch (err) {
      throw extractError(err);
    }
  },

  update: async (id, payload) => {
    try {
      const { data } = await client.put(`/trips/${id}`, payload);
      return data;
    } catch (err) {
      throw extractError(err);
    }
  },

  remove: async (id) => {
    try {
      const { data } = await client.delete(`/trips/${id}`);
      return data;
    } catch (err) {
      throw extractError(err);
    }
  },

  alerts: async () => {
    try {
      const { data } = await client.get('/trips/alerts');
      return data;
    } catch (err) {
      throw extractError(err);
    }
  },
};
