"use client";

import { createContext, useEffect, useState } from "react";
import { openDB } from "idb";

const DataContext = createContext();

const DB_NAME = "IslamicDB";
const STORE_NAME = "asmaUlHusna";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export function DataProvider({ children }) {
  const [Alnames, setAlnames] = useState([]);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);

  const fetchAlnames = async () => {
    setLoading(true);

    try {
      const db = await getDB();

      // Check IndexedDB first
      const cachedData = await db.get(STORE_NAME, language);

      if (cachedData) {
        console.log(`Loaded ${language} names from IndexedDB`);
        setAlnames(cachedData);
        setLoading(false);
        return;
      }

      console.log(`Fetching ${language} names from API`);

      const response = await fetch(
        `https://islamicapi.com/api/v1/asma-ul-husna/?language=${language}&api_key=JfrgLjnzoy6tNgMzMzvMbAQ6xrXcXHfqKKwHu7KJebjEANDJ`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const { data } = await response.json();
      const names = data.names;

      // Save to IndexedDB
      await db.put(STORE_NAME, names, language);

      setAlnames(names);
    } catch (error) {
      console.error("Error fetching Alnames:", error);

      // Try loading cached data if network failed
      try {
        const db = await getDB();
        const cachedData = await db.get(STORE_NAME, language);

        if (cachedData) {
          console.log(`Loaded cached ${language} data`);
          setAlnames(cachedData);
        }
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  // Optional: Cache both languages on first app launch
  const preloadLanguages = async () => {
    const db = await getDB();

    for (const lang of ["en", "sw"]) {
      const exists = await db.get(STORE_NAME, lang);

      if (!exists) {
        try {
          const response = await fetch(
            `https://islamicapi.com/api/v1/asma-ul-husna/?language=${lang}&api_key=JfrgLjnzoy6tNgMzMzvMbAQ6xrXcXHfqKKwHu7KJebjEANDJ`,
          );

          if (!response.ok) continue;

          const { data } = await response.json();

          await db.put(STORE_NAME, data.names, lang);

          console.log(`Cached ${lang}`);
        } catch (err) {
          console.log(`Couldn't preload ${lang}`, err);
        }
      }
    }
  };

  useEffect(() => {
    preloadLanguages();
  }, []);

  useEffect(() => {
    fetchAlnames();
  }, [language]);

  return (
    <DataContext.Provider
      value={{
        Alnames,
        setAlnames,
        language,
        setLanguage,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;
