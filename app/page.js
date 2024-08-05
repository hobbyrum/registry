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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const urlPrefix = "https://www.flashback.org/";

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  }

  return ( // return-main
    <div>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white p-4"> { /* div-main */ }
        <div className="sticky mb-4 flex justify-between items-center">
          <Search query={query} setQuery={setQuery} />
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </div>
        <Table
          data={data}
          query={query}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          urlPrefix={urlPrefix}
        />
        <div> { /* div-label */ }
          <label htmlFor='itemsPerPage' className='mr-2'>Rader per sida:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className='rounded p-2 bg-white dark:bg-gray-700 dark:text-white'
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>

          </select>
        </div> { /* end of div-label */ }
      </div> { /* end of div-main */}
    </div>
  ); // End of return-main
} // End of Home
