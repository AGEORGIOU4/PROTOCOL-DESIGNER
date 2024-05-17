import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
    generateSuggestions(inputValue);
  };

  const generateSuggestions = (inputValue) => {

    // Example of basic keyword matching for suggestions
    const suggestionsMap = {
      mountain: ["nature", "hiking", "scenery"],
      beach: ["ocean", "sand", "relaxation"],
      city: ["urban", "architecture", "culture"],
      // Add more keywords and related suggestions as needed
    };

    const relatedSuggestions = suggestionsMap[inputValue.toLowerCase()] || [];
    console.log(relatedSuggestions)
    setSuggestions(relatedSuggestions);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your search query"
        value={query}
        onChange={handleInputChange}
      />
      <div className="suggestion-container">
        {suggestions.map((item, index) => {
          return (
            <h1>{item}</h1>
          )
        })}
      </div>
    </div>
  );
};

export default Login;
