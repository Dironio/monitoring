import { useState } from "react";
import './SearchBar.css'

interface SearchBarProps {
    onSearch: (query: string) => void;
    results: Array<{ label: string; path: string }>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, results }) => {
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Поиск..."
                value={query}
                onChange={handleSearch}
                className="search-input"
            />
            {query && results.length > 0 && (
                <div className="search-results">
                    {results.map((result) => (
                        <div
                            key={result.path}
                            className="search-result"
                            onClick={() => (window.location.href = result.path)}
                        >
                            {result.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;