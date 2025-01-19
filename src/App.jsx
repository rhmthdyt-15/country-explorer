import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CountrySearch from "./components/CountrySearch";
import CountryDetail from "./components/CountryDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CountrySearch />} />
        <Route path="/country/:countryName" element={<CountryDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
