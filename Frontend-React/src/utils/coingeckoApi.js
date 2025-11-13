import axios from "axios";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

// Delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Create axios instance with default config for CoinGecko API
const coingeckoAxios = axios.create({
  baseURL: COINGECKO_API,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Retry function with exponential backoff
const retryRequest = async (requestFn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      // If it's a 429 error and we have retries left, wait and retry
      if (error.response?.status === 429 && attempt < maxRetries - 1) {
        const retryAfter = error.response.headers['retry-after'] 
          ? parseInt(error.response.headers['retry-after']) * 1000 
          : baseDelay * Math.pow(2, attempt);
        
        console.warn(`Rate limited. Retrying after ${retryAfter}ms (attempt ${attempt + 1}/${maxRetries})`);
        await delay(retryAfter);
        continue;
      }
      
      // If it's not a 429 or we're out of retries, throw the error
      throw error;
    }
  }
};

// Make a request with retry logic
export const coingeckoRequest = async (endpoint, params = {}, options = {}) => {
  const { maxRetries = 3, delayBeforeRequest = 0 } = options;
  
  // Add delay before request to avoid hitting rate limits
  if (delayBeforeRequest > 0) {
    await delay(delayBeforeRequest);
  }
  
  return retryRequest(
    async () => {
      try {
        // Use the axios instance for better error handling
        const response = await coingeckoAxios.get(endpoint, {
          params,
        });
        return response;
      } catch (error) {
        // Log more details for debugging
        console.error(`CoinGecko API error for ${endpoint}:`, {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          fullError: error,
        });
        
        // Re-throw with more context
        if (error.code === 'ERR_NETWORK' || !error.response) {
          const networkError = new Error(`Network error: ${error.message}`);
          networkError.code = error.code;
          networkError.originalError = error;
          throw networkError;
        }
        throw error;
      }
    },
    maxRetries
  );
};

// Sequential requests with delays to avoid rate limits
export const coingeckoSequentialRequests = async (requests, delayBetweenRequests = 500) => {
  const results = [];
  
  for (let i = 0; i < requests.length; i++) {
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
      try {
        const result = await requests[i]();
        results.push(result);
        
        // Add delay between requests (except for the last one)
        if (i < requests.length - 1) {
          await delay(delayBetweenRequests);
        }
        break; // Success, exit retry loop
      } catch (error) {
        console.error(`Request ${i + 1} failed (attempt ${retries + 1}/${maxRetries}):`, error.message);
        
        // If it's a rate limit error, wait longer before retrying
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] 
            ? parseInt(error.response.headers['retry-after']) * 1000 
            : 2000 * (retries + 1);
          console.warn(`Rate limited. Waiting ${retryAfter}ms before retry`);
          await delay(retryAfter);
          retries++;
          continue;
        }
        
        // If it's a network error and we have retries left, wait and retry
        if ((error.code === 'ERR_NETWORK' || !error.response) && retries < maxRetries - 1) {
          console.warn(`Network error. Retrying after ${1000 * (retries + 1)}ms`);
          await delay(1000 * (retries + 1));
          retries++;
          continue;
        }
        
        // If we're out of retries or it's a different error, throw it
        throw error;
      }
    }
  }
  
  return results;
};

export default coingeckoRequest;

