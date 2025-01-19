import { useState, useEffect } from "react";
import CountryDropdown from "./CountryDropdown";
import { searchCountryByName } from "../services/api";
import useDebounce from "../hooks/useDebounce";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CountrySearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const navigate = useNavigate(); // Hook untuk navigasi ke halaman detail

  useEffect(() => {
    if (debouncedSearchQuery) {
      handleSearch(debouncedSearchQuery);
    } else {
      setCountries([]);
      setError(null);
    }
  }, [debouncedSearchQuery]);

  const handleSearch = async (query) => {
    setError(null);
    try {
      const data = await searchCountryByName(query);
      setCountries(data.slice(0, 5)); // Batasi hasil pencarian
    } catch {
      setCountries([]);
      setError("Data not found.");
    }
  };

  const handleSelectCountry = (countryName) => {
    const countryDetail = countries.find(
      (country) => country.name.common === countryName
    );
    setSearchQuery(countryName);
    setSelectedCountry(countryDetail); // Simpan detail negara yang dipilih
    setCountries([]);
    setIsActive(true);
  };

  const handleSearchIconClick = () => {
    if (selectedCountry) {
      navigate(`/country/${selectedCountry.name.common}`, {
        state: { country: selectedCountry }, // Kirim data negara ke halaman detail
      });
    } else {
      setError("Please select a country first.");
    }
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    if (!searchQuery) {
      setIsActive(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-20">
      <h1 className="text-[72px] font-bold leading-[86px] text-center mb-16">
        Country
      </h1>
      <div className="relative w-[696px]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a country"
            className={`w-full h-14 px-4 rounded-lg border transition-colors duration-200 focus:outline-none ${
              isActive || searchQuery ? "border-purple-500" : "border-gray-200"
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <Search
            onClick={handleSearchIconClick} // Tambahkan handler klik ikon search
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer transition-colors duration-200 ${
              isActive || searchQuery ? "text-purple-500" : "text-gray-400"
            }`}
          />
        </div>
        {countries.length > 0 && (
          <CountryDropdown
            countries={countries}
            onSelect={handleSelectCountry}
          />
        )}
        {error && <p className="text-red-500 mt-2 text-left">{error}</p>}
      </div>
    </div>
  );
};

export default CountrySearch;
