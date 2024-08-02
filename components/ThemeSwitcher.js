export default function ThemeSwitcher({ theme, setTheme }) {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button onClick={toggleTheme} className="p-2 bg-blue-500 text-white rounded">
      {theme === 'light' ? 'Mörkt' : 'Ljust'}
    </button>
  );
}