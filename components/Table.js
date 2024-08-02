import { useState, useEffect } from 'react';

const Table = ({ data, query, currentPage, itemsPerPage, setCurrentPage }) => {
  const filterData = (data, query) => {
    if (!query) return data;
    return data.filter(row =>
      Object.values(row).some(value =>
        value ? value.toString().toLowerCase().includes(query.toLowerCase()) : false
      )
    );
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

  const filteredData = filterData(data, query);
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="py-2">Domstol</th>
            <th className="py-2">Målnummer</th>
            <th className="py-2">År</th>
            <th className="py-2">Brott</th>
            <th className="py-2">FUP</th>
            <th className="py-2">Dom</th>
            <th className="py-2">Påföljd</th>
            <th className="py-2">Notat</th>
            <th className="py-2">Flashbacktråd</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              <td className="py-2">{highlightText(row.Domstol, query)}</td>
              <td className="py-2">{highlightText(row.Målnummer, query)}</td>
              <td className="py-2">{highlightText(row.År, query)}</td>
              <td className="py-2">{highlightText(row.Brott, query)}</td>
              <td className="py-2">{highlightText(row.FUP, query)}</td>
              <td className="py-2">{highlightText(row.Dom, query)}</td>
              <td className="py-2">{highlightText(row.Påföljd, query)}</td>
              <td className="py-2">{highlightText(row.Notat, query)}</td>
              <td className="py-2">{highlightText(row.Flashbacktråd, query)}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Föregåående
      </button>
      {[...Array(totalPages).keys()].map((page) => (
        <button
          key={page}
          onClick={() => handleClick(page + 1)}
          className={`px-4 py-2 mx-1 ${
            currentPage === page + 1
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300'
          } rounded`}
        >
          {page + 1}
        </button>
      ))}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Nästa
      </button>
    </div>
  );
};

export default Table;
