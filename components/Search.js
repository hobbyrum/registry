export default function Search({ query, setQuery }) {
    return (
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
        className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
      />
    );
  }