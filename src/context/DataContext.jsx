"use client";

import { createContext, useState, useEffect } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [Alnames, setAlnames] = useState([]);
  const [language, setLanguage] = useState("sw");

  const fetchAlnames = async () => {
    try {
      const response = await fetch(
        `https://islamicapi.com/api/v1/asma-ul-husna/?language=${language}&api_key=${process.env.NEXT_ISLAMIC_API_KEY}`,
      );
      const data = await response.json();
      setAlnames(data);
    } catch (error) {
      console.error("Error fetching Alnames:", error);
    }
  };

  useEffect(() => {
    fetchAlnames();
  }, [language]);

  return (
    <DataContext.Provider
      value={{ Alnames, setAlnames, language, setLanguage }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;
