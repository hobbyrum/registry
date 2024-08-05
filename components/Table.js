import { useState, useEffect } from 'react';

const BASE_URL = 'https://www.flashback.org/';

const Table = ({ data, query, currentPage, itemsPerPage, setCurrentPage }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showFlashbacktråd, setShowFlashbacktråd] = useState(false);
  const [showFUP, setShowFUP] = useState(false);
  const [showDom, setShowDom] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filterData = (data, query, showFlashbacktråd, showFUP, showDom) => {
      let filteredData = data;

      if (query) {
        filteredData = filteredData.filter(row =>
          Object.values(row).some(value =>
            value ? value.toString().toLowerCase().includes(query.toLowerCase()) : false
          )
        );
      }

      if (showFlashbacktråd) {
        filteredData = filteredData.filter(row => row['Flashbacktråd']);
      }
      
      if (showFUP) {
        filteredData = filteredData.filter(row => row['FUP']);
      }
      
      if (showDom) {
        filteredData = filteredData.filter(row => row['Dom']);
      }

      return filteredData;
    };

    const sortedData = sortData(filterData(data || [], query, showFlashbacktråd, showFUP, showDom), sortConfig);
    setFilteredData(sortedData);
  }, [data, query, showFlashbacktråd, showFUP, showDom, sortConfig]);

  const sortData = (data, config) => {
    if (!config.key) return data;
    const sortedData = [...(data || [])].sort((a, b) => {
      if (a[config.key] < b[config.key]) {
        return config.direction === 'ascending' ? -1 : 1;
      }
      if (a[config.key] > b[config.key]) {
        return config.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortedData;
  };

  const handleHeaderClick = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const highlightText = (text, query) => {
    if (!text) return text;
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const clearFilters = () => {
    setShowFlashbacktråd(false);
    setShowFUP(false);
    setShowDom(false);
    setSortConfig({ key: null, direction: 'ascending' }); // Optional: Reset sort

    // Update filteredData to include all data
    setFilteredData(data);
  };

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRangeMessage = () => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return `Visar ${start} till ${end} av ${totalItems} rader`;
  };

  const tableHeaders = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <>
      <div className="mb-4 flex flex-col md:flex-row items-start">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-4 py-2 bg-gray-300 rounded dark:bg-gray-700 dark:text-white"
          >
            Filter
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-20">
              <div className="p-2 text-black dark:text-white">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showFlashbacktråd}
                    onChange={(e) => setShowFlashbacktråd(e.target.checked)}
                    className="mr-2"
                  />
                  Flashbacktråd
                </label>
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={showFUP}
                    onChange={(e) => setShowFUP(e.target.checked)}
                    className="mr-2"
                  />
                  FUP
                </label>
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={showDom}
                    onChange={(e) => setShowDom(e.target.checked)}
                    className="mr-2"
                  />
                  Dom
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="ml-4 text-black dark:text-white">{getRangeMessage()}</div>
        <button
          onClick={clearFilters}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Rensa filter
        </button>
      </div>
      <div>
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`p-2 cursor-pointer text-left bg-gray-600 ${
                    sortConfig.key === header ? (sortConfig.direction === 'ascending' ? 'sorted-asc' : 'sorted-desc') : ''
                  }`}
                  onClick={() => handleHeaderClick(header)}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className='p-2 text-black dark:text-white dark:hover:bg-gray-700 dark:even:bg-gray-800 hover:bg-gray-400'>
                {tableHeaders.map((header, idx) => (
                  <td key={idx} className="p-2 text-left">
                    {header === 'Flashbacktråd' && row[header] ? (
                      <a
                        href={`${BASE_URL}${row[header]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {row[header]}
                      </a>
                    ) : (
                      highlightText(row[header], query)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const handleDropdownChange = (event) => {
    setCurrentPage(Number(event.target.value));
  };

  return (
    <div className="flex justify-center mt-4 items-center">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Föregående
      </button>
      {currentPage > 1 && (
        <button
          onClick={() => handleClick(currentPage - 1)}
          className="px-4 py-2 mx-1 bg-gray-300 rounded"
        >
          {currentPage - 1}
        </button>
      )}
      <span className="px-4 py-2 mx-1 bg-blue-500 text-white rounded">
        {currentPage}
      </span>
      {currentPage < totalPages && (
        <button
          onClick={() => handleClick(currentPage + 1)}
          className="px-4 py-2 mx-1 bg-gray-300 rounded"
        >
          {currentPage + 1}
        </button>
      )}
      {currentPage < totalPages - 1 && (
        <button
          onClick={() => handleClick(currentPage + 2)}
          className="px-4 py-2 mx-1 bg-gray-300 rounded"
        >
          {currentPage + 2}
        </button>
      )}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Nästa
      </button>
      <select
        value={currentPage}
        onChange={handleDropdownChange}
        className="ml-4 p-2 bg-white dark:bg-gray-700 dark:text-white rounded"
      >
        {Array.from({ length: totalPages }, (_, index) => (
          <option key={index + 1} value={index + 1}>
            Sida {index + 1}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Table;
