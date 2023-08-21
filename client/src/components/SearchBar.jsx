import React, { useEffect, useState } from "react";
import { GetSearchResults } from "../api/filters";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ filters, setFilters }) => {
  // State
  const [hideResults, setHideResults] = useState(false);
  const [results, setResults] = useState([]);

  // Variable
  const navigate = useNavigate();

  // Handler
  const getData = async () => {
    try {
      const response = await GetSearchResults(filters);
      setResults(response.data);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (filters.search) {
      // Use debounce
      const debounce = setTimeout(() => {
        getData();
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [filters.search]);

  return (
    <div className="flex items-end w-full">
      <div className="w-full relative">
        <input
          type="text"
          placeholder="Search Movies / Artists"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          onBlur={() => {
            setTimeout(() => {
              setHideResults(true);
            }, 200);
          }}
          onFocus={() => setHideResults(false)}
          className="search-bar"
        />

        {/* Results Div */}
        {filters.search && !hideResults && (
          <div className="search-results text-gray-600">
            {/* Movies */}
            {results?.movies?.length > 0 &&
              results.movies.map((movie) => {
                return (
                  <div
                    key={movie?._id}
                    className="flex gap-10 items-center border p-2 cursor-pointer mt-2"
                    onClick={() => navigate(`/movie/${movie?._id}`)}
                  >
                    <img
                      src={movie?.posters[0]}
                      alt=""
                      className="h-10 w-10 rounded"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-500 text-md">
                        {movie?.name}
                      </span>
                      <span className="text-sm">Movie</span>
                    </div>
                  </div>
                );
              })}

            {/* Artists */}
            {results?.artists?.length > 0 &&
              results.artists.map((artist) => {
                return (
                  <div
                    key={artist?._id}
                    className="flex gap-10 items-center border p-2 cursor-pointer mt-2"
                    onClick={() => navigate(`/artist/${artist?._id}`)}
                  >
                    <img
                      src={artist?.images[0]}
                      alt=""
                      className="h-12 w-10 rounded"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-500 text-md">
                        {artist?.name}
                      </span>
                      <span className="text-sm">Artist</span>
                    </div>
                  </div>
                );
              })}

            {/* No results found */}
            {results?.movies?.length === 0 &&
              results?.artists?.length === 0 && (
                <div className="text-gray-500 mt-2 p-5">No results found</div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
