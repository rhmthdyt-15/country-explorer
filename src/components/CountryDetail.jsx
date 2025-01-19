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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setError(null);
        setLoadingTooltip(true);

        const countryData = await getCountryDetails(countryName);
        setCountry(countryData);

        if (countryData.idd && countryData.currencies) {
          const callingCode =
            countryData.idd.root + (countryData.idd.suffixes?.[0] || "");
          const currency = Object.keys(countryData.currencies)[0];

          const [callingCodeCountries, currencyCountries] =
            await Promise.allSettled([
              getCountriesByCallingCode(callingCode),
              getCountriesByCurrency(currency),
            ]);

          setTooltip({
            callingCodeCountries:
              callingCodeCountries.status === "fulfilled"
                ? callingCodeCountries.value?.map((c) => c.name.common)
                : [],
            currencyCountries:
              currencyCountries.status === "fulfilled"
                ? currencyCountries.value?.map((c) => c.name.common)
                : [],
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load country data");
      } finally {
        setLoadingTooltip(false);
      }
    };

    if (countryName) {
      fetchCountryData();
    }

    return () => {
      setCountry(null);
      setTooltip(null);
      setError(null);
    };
  }, [countryName]);

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="mx-auto max-w-5xl">
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
          <div className="rounded-xl bg-red-50 p-6">
            <h2 className="mb-2 text-lg font-semibold text-red-800">Error</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        {!country && !error ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent"></div>
              <p className="text-gray-500">Loading country details...</p>
            </div>
          </div>
        ) : country ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">{country.name.common}</h1>
                <img
                  src={country.flags.svg}
                  alt={`${country.name.common} flag`}
                  className="h-6"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-flag.png";
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {country.altSpellings?.map((spelling, index) => (
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
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-8">
                {/* LatLong Section */}
                <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg">
                  <div className="relative z-10">
                    <h3 className="mb-2 text-gray-600">LatLong</h3>
                    <p className="text-4xl font-bold text-[#7C3AED]">
                      {country.latlng?.[0]}, {country.latlng?.[1]}
                    </p>
                  </div>
                  <img
                    src="/images/globe1.png"
                    alt="Map Background"
                    className="absolute right-0 top-0 h-full w-1/2 opacity-10"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>

                {/* Calling Code Section */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h3 className="mb-2 text-gray-600">Calling Code</h3>
                  <p className="mb-2 text-4xl font-bold text-[#7C3AED]">
                    {country.idd?.root}
                    {country.idd?.suffixes?.[0]}
                  </p>
                  {!loadingTooltip && tooltip?.callingCodeCountries && (
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
                        {tooltip.callingCodeCountries.length}{" "}
                        {tooltip.callingCodeCountries.length === 1
                          ? "country"
                          : "countries"}
                      </button>{" "}
                      with this calling code
                      {showTooltip.calling && (
                        <div className="absolute left-0 top-full z-10 mt-2 w-64 rounded-xl bg-gray-700 p-4 shadow-lg">
                          <ul className="space-y-1 text-sm text-white">
                            {tooltip.callingCodeCountries.length > 0 ? (
                              tooltip.callingCodeCountries.map(
                                (name, index) => (
                                  <li key={`${name}-${index}`}>{name}</li>
                                )
                              )
                            ) : (
                              <li>No other countries found</li>
                            )}
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
                  <p className="mb-2">
                    <span className="text-gray-600">Capital:</span>{" "}
                    <strong>{country.capital?.[0] || "N/A"}</strong>
                  </p>
                  <p className="mb-2">
                    <span className="text-gray-600">Region:</span>{" "}
                    <strong>{country.region || "N/A"}</strong>
                  </p>
                  <p>
                    <span className="text-gray-600">Subregion:</span>{" "}
                    <strong>{country.subregion || "N/A"}</strong>
                  </p>
                </div>

                {/* Currency Section */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  <h3 className="mb-2 text-gray-600">Currency</h3>
                  <p className="mb-2 text-4xl font-bold text-[#7C3AED]">
                    {Object.keys(country.currencies || {})[0]}
                  </p>
                  {!loadingTooltip && tooltip?.currencyCountries && (
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
                        {tooltip.currencyCountries.length}{" "}
                        {tooltip.currencyCountries.length === 1
                          ? "country"
                          : "countries"}
                      </button>{" "}
                      with this currency
                      {showTooltip.currency && (
                        <div className="absolute left-0 top-full z-10 mt-2 w-64 rounded-xl bg-gray-700 p-4 shadow-lg">
                          <ul className="space-y-1 text-sm text-white">
                            {tooltip.currencyCountries.length > 0 ? (
                              tooltip.currencyCountries.map((name, index) => (
                                <li key={`${name}-${index}`}>{name}</li>
                              ))
                            ) : (
                              <li>No other countries found</li>
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
        ) : null}
      </div>
    </div>
  );
};

export default CountryDetail;
