import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCountryDetails,
  getCountriesByCallingCode,
  getCountriesByCurrency,
} from "../services/api";

const CountryDetail = () => {
  const { countryName } = useParams();
  const [country, setCountry] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [showTooltip, setShowTooltip] = useState({
    calling: false,
    currency: false,
  });
  const [loadingTooltip, setLoadingTooltip] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const countryData = await getCountryDetails(countryName);
        setCountry(countryData);

        if (countryData.idd && countryData.currencies) {
          const callingCode =
            countryData.idd.root + countryData.idd.suffixes[0];
          const currency = Object.keys(countryData.currencies)[0];

          console.log("Currency Code:", currency); // Log kode mata uang

          const [callingCodeCountries, currencyCountries] = await Promise.all([
            getCountriesByCallingCode(callingCode),
            getCountriesByCurrency(currency),
          ]);

          console.log("Currency Countries:", currencyCountries); // Log data

          // Ambil nama negara dari currencyCountries
          setTooltip({
            callingCodeCountries: callingCodeCountries.map(
              (c) => c.name.common
            ),
            currencyCountries: currencyCountries.map((c) => c.name), // Pastikan ini sesuai
          });
        }
      } catch (error) {
        console.error("Error fetching country data:", error);
      } finally {
        setLoadingTooltip(false);
      }
    };

    fetchCountryData();
  }, [countryName]);

  return (
    <div className="min-h-screen bg-white p-8">
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <div className="mx-auto max-w-5xl">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3 text-white hover:bg-purple-700"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Homepage
        </button>

        {country ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">{country.name.common}</h1>
                <img
                  src={country.flags.svg}
                  alt={`${country.name.common} flag`}
                  className="h-6"
                />
              </div>
              <div className="flex gap-2">
                {country.altSpellings.map((spelling, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[#99E6E6] px-4 py-1 text-sm"
                  >
                    {spelling}
                  </span>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* LatLong Section */}
                <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg">
                  <div className="relative z-10">
                    <h3 className="mb-2 text-gray-600">LatLong</h3>
                    <p className="text-4xl font-bold text-[#7C3AED]">
                      {country.latlng[0]}, {country.latlng[1]}
                    </p>
                  </div>
                  <img
                    src="/images/globe1.png"
                    alt="Map Background"
                    className="absolute right-0 top-0 h-full w-1/2 opacity-10"
                  />
                </div>

                {/* Calling Code Section */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h3 className="mb-2 text-gray-600">Calling Code</h3>
                  <p className="mb-2 text-4xl font-bold text-[#7C3AED]">
                    {country.idd?.root.replace("+", "")}
                    {country.idd?.suffixes[0]}
                  </p>
                  {!loadingTooltip && tooltip && (
                    <div
                      className="relative"
                      onMouseEnter={() =>
                        setShowTooltip({ ...showTooltip, calling: true })
                      }
                      onMouseLeave={() =>
                        setShowTooltip({ ...showTooltip, calling: false })
                      }
                    >
                      <button className="text-sm text-[#7C3AED] underline">
                        {tooltip.callingCodeCountries.length} country
                      </button>{" "}
                      with this calling code
                      {showTooltip.calling && (
                        <div className="absolute left-0 top-full z-10 mt-2 w-64 rounded-xl bg-gray-700 p-4 shadow-lg">
                          <ul className="space-y-1 text-sm text-white">
                            {tooltip.callingCodeCountries.map((name, index) => (
                              <li key={name + index}>{name}</li> // Menggunakan name + index sebagai key
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Region Info */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <p>
                    Capital: <strong>{country.capital?.[0] || "N/A"}</strong>
                  </p>
                  <p>
                    Region: <strong>{country.region}</strong>
                  </p>
                  <p>
                    Subregion: <strong>{country.subregion}</strong>
                  </p>
                </div>

                {/* Currency Section */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h3 className="mb-2 text-gray-600">Currency</h3>
                  <p className="mb-2 text-4xl font-bold text-[#7C3AED]">
                    {Object.keys(country.currencies || {})[0]}
                  </p>
                  {!loadingTooltip && tooltip && (
                    <div
                      className="relative"
                      onMouseEnter={() =>
                        setShowTooltip({ ...showTooltip, currency: true })
                      }
                      onMouseLeave={() =>
                        setShowTooltip({ ...showTooltip, currency: false })
                      }
                    >
                      <button className="text-sm text-[#7C3AED] underline">
                        {tooltip.currencyCountries.length} country
                      </button>{" "}
                      with this currency
                      {showTooltip.currency && (
                        <div className="absolute left-0 top-full z-10 mt-2 w-64 rounded-xl bg-gray-700 p-4 shadow-lg">
                          <ul className="space-y-1 text-sm text-white">
                            {tooltip.currencyCountries.length > 0 ? (
                              tooltip.currencyCountries.map(
                                (country, index) => (
                                  <li key={country + index}>{country}</li> // Menggunakan country + index sebagai key
                                )
                              )
                            ) : (
                              <li>No countries found</li> // Menangani kasus di mana tidak ada negara
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-500">Loading country details...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryDetail;
