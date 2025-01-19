import PropTypes from "prop-types";

const CountryDropdown = ({ countries, onSelect }) => {
  return (
    <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-lg overflow-hidden shadow-lg">
      {countries.map((country) => (
        <li
          key={country.cca3}
          className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-800"
          onClick={() => onSelect(country.name.common)}
        >
          {country.name.common}
        </li>
      ))}
    </ul>
  );
};

CountryDropdown.propTypes = {
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      cca3: PropTypes.string.isRequired,
      name: PropTypes.shape({
        common: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CountryDropdown;
