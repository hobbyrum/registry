'use client'

import { useState, useEffect } from 'react';
import Table from '../components/Table';
import Search from '../components/Search';
import ThemeSwitcher from '../components/ThemeSwitcher';

export default function Home() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust this number to set items per page

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white p-4">
      <div className="mb-4 flex justify-between items-center">
        <Search query={query} setQuery={setQuery} />
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>
      <Table
        data={data}
        query={query}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
