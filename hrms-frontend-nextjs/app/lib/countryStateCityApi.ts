import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_COUNTRY_STATE_CITY_API_URL; // Securely store API URL in .env file
const API_KEY = process.env.NEXT_PUBLIC_COUNTRY_STATE_CITY_API_KEY; // Securely store API key in .env file

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "X-CSCAPI-KEY": API_KEY as string, // Type assertion to prevent TS errors
  },
});

// Fetch all countries
export const getCountries = async () => {
  try {
    const response = await apiClient.get("/countries");
    return response.data; // Returns the list of countries
  } catch (error) {
    console.error("Error fetching countries:",error);
    throw error;
  }
};

// Fetch states by country code
export const getStatesByCountry = async (countryCode: string) => {
  try {
    const response = await apiClient.get(`/countries/${countryCode}/states`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching states for ${countryCode}:`, error);
    throw error;
  }
};

// Fetch cities by state and country code
export const getCitiesByState = async (countryCode: string, stateCode: string) => {
  try {
    const response = await apiClient.get(`/countries/${countryCode}/states/${stateCode}/cities`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cities for ${stateCode}, ${countryCode}:`, error);
    throw error;
  }
};
