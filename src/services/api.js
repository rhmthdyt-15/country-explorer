import axios from "axios";

const BASE_URL = "https://restcountries.com/v3.1";

export const searchCountryByName = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Nou Countries found");
  }
};

export const getCountryDetails = async (countryName) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/name/${countryName}?fullText=true`
    );
    return response.data[0];
  } catch (error) {
    console.error("Failed to fetch country details:", error);
    throw error;
  }
};

export const getCountriesByCallingCode = async (callingCode) => {
  try {
    const { data } = await axios.get("https://restcountries.com/v3.1/all");
    return data.filter(
      (country) =>
        country.idd &&
        country.idd.root + (country.idd.suffixes?.[0] || "") === callingCode
    );
  } catch (error) {
    console.error("Error fetching countries by calling code:", error);
    throw error;
  }
};

export const getCountriesByCurrency = async (currencyCode) => {
  try {
    const response = await axios.get(
      `https://restcountries.com/v2/currency/${currencyCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch countries by currency:", error);
    throw error;
  }
};
