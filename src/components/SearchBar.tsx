interface SearchBarProps {
  onSearch: (query: string) => void; // Function to call when user types
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for tools (e.g., 'drill', 'mower')"
        onChange={(e) => onSearch(e.target.value)} // Call onSearch every time user types
        aria-label="Search tools"
      />
    </div>
  );
}
