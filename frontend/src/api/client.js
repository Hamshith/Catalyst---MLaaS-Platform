import axios from 'axios';
import toast from 'react-hot-toast';

function createClient(baseURL) {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('catalyst_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const httpStatus = error.response?.status;
      const data = error.response?.data;

      // Try to find the best error code (prefer nested over HTTP)
      const errorCode = data?.error?.code || data?.code || httpStatus;

      // Try every known pattern to pull out a short human message
      function getCleanMessage() {
        if (!data) return error.message || 'An unexpected error occurred';
        const raw = typeof data === 'string' ? data : null;

        // 1. Nested JSON: { error: { message: "..." } }
        if (data?.error?.message && typeof data.error.message === 'string') {
          return firstSentence(data.error.message);
        }
        // 2. Top level: { message: "..." }
        if (typeof data?.message === 'string') return firstSentence(data.message);
        // 3. FastAPI: { detail: "..." }
        if (typeof data?.detail === 'string') return firstSentence(data.detail);
        // 4. FastAPI validation: { detail: [{msg}, ...] }
        if (Array.isArray(data?.detail)) {
          const msgs = data.detail.map((e) => e.msg || e.message).filter(Boolean);
          return msgs.length ? msgs[0] : 'Validation error';
        }
        // 5. Raw string body — try to extract 'message': '...' from stringified dict
        if (raw) return firstSentence(raw);
        // 6. Fallback
        return error.message || 'An unexpected error occurred';
      }

      // Extract just the first clean sentence, strip any embedded dicts/JSON/URLs
      function firstSentence(str) {
        if (!str) return 'Something went wrong';
        // If string contains a Python dict, try to extract message from within it
        const pyMsg = str.match(/'message'\s*:\s*'([^']+)'/);
        if (pyMsg) str = pyMsg[1];
        // Strip escaped newlines and everything after
        str = str.split(/\\n|\n/)[0].trim();
        // Take first sentence (ends with . followed by space+capital, or end of string)
        const match = str.match(/^(.+?\.)\s+[A-Z]/);
        if (match) str = match[1];
        // Cap length
        if (str.length > 120) str = str.substring(0, 117) + '...';
        return str;
      }

      const message = getCleanMessage();
      const displayMessage = errorCode ? `Error ${errorCode}: ${message}` : message;

      if (httpStatus === 401) {
        localStorage.removeItem('catalyst_token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      if (httpStatus !== 401) {
        toast.error(displayMessage);
      }

      return Promise.reject({ message: displayMessage, status: httpStatus });
    }
  );

  return instance;
}

export const userClient = createClient(import.meta.env.VITE_USER_SERVICE_URL);
export const datasetClient = createClient(import.meta.env.VITE_DATASET_SERVICE_URL);
export const recommendationClient = createClient(import.meta.env.VITE_RECOMMENDATION_SERVICE_URL);
export const modelClient = createClient(import.meta.env.VITE_MODEL_SERVICE_URL);
export const creditClient = createClient(import.meta.env.VITE_CREDIT_SERVICE_URL);
