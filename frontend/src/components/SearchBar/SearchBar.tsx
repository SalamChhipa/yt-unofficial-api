import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search songs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '8px', width: '300px' }}
      />
      <button onClick={() => onSearch(query)} style={{ padding: '8px 12px', marginLeft: '10px' }}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
