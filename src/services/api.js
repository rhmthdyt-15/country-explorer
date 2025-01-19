import axios from "axios";

const BASE_URL = "https://restcountries.com/v3.1";

// Create axios instance with retry logic
const axiosInstance = axios.create({
  timeout: 8000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add retry interceptor
axiosInstance.interceptors.response.use(null, async (error) => {
  if (error.config && error.config.__retryCount < 3) {
    error.config.__retryCount = error.config.__retryCount || 0;
    error.config.__retryCount++;

    // Wait before retrying
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 * error.config.__retryCount)
    );
    return axiosInstance(error.config);
  }
  return Promise.reject(error);
});

export const searchCountryByName = async (name) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    console.error("Search country error:", error);
    return [];
  }
};

export const getCountryDetails = async (countryName) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/name/${countryName}?fullText=true`
    );
    return response.data[0];
  } catch (error) {
    console.error("Country details error:", error);
    throw new Error("Failed to fetch country details");
  }
};

export const getCountriesByCallingCode = async (callingCode) => {
  try {
    // Remove '+' if present and clean the code
    const cleanCode = callingCode.replace(/\+/g, "").trim();
    const response = await axiosInstance.get(`${BASE_URL}/all`);

    return response.data.filter((country) => {
      if (!country.idd?.root) return false;
      const countryCode = country.idd.root + (country.idd.suffixes?.[0] || "");
      return countryCode.replace(/\+/g, "") === cleanCode;
    });
  } catch (error) {
    console.error("Calling code error:", error);
    return [];
  }
};

export const getCountriesByCurrency = async (currencyCode) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/currency/${currencyCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Currency search error:", error);
    return [];
  }
};
