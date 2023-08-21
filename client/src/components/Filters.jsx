import React, { useEffect, useState } from "react";

const Filters = ({ filters, setFilters }) => {
  return (
    <div className="mb-5 flex gap-5 items-end md:flex-row flex-col">
      <div className="flex flex-col w-full md:w-1/4">
        <label htmlFor="language" className="text-sm text-gray-500">
          Select Language
        </label>
        <select
          id="language"
          name="language"
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
        >
          <option value="">All</option>
          <option value="English">English</option>
          <option value="Chinese">Chinese</option>
          <option value="Hindi">Hindi</option>
          <option value="Korean">Korean</option>
          <option value="Japanese">Japanese</option>
        </select>
      </div>

      <div className="flex flex-col w-full md:w-1/4">
        <label htmlFor="genre" className="text-sm text-gray-500">
          Select Genre
        </label>
        <select
          id="genre"
          name="genre"
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
        >
          <option value="">All</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Horror">Horror</option>
          <option value="Romance">Romance</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
