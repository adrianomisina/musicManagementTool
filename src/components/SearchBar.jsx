/* eslint-disable react/prop-types */
// SearchBar.jsx
import { CiSearch } from "react-icons/ci";

const SearchBar = ({ value, onChange, onSearch, title }) => (
  <div className="p-4">
    <label htmlFor="search" className="text-gray-600">{title}</label>
    <div className="relative flex items-stretch">
      <input
        type="text"
        id="search"
        name="search"
        value={value}
        onChange={onChange}
        className="w-full py-2 border border-gray-400  pl-2 pr-10 rounded-md focus:outline-none focus:border-purple-500"
      />
      <button type="button" className="absolute inset-y-0 right-0 px-3 py-2" onClick={onSearch}>
        <CiSearch />
      </button>
    </div>
  </div>
);

export default SearchBar;
