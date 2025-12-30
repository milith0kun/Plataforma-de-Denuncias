import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

/**
 * Componente de barra de búsqueda con debounce
 * @param {Object} props
 * @param {string} props.placeholder - Texto del placeholder
 * @param {Function} props.onSearch - Callback con el término de búsqueda
 * @param {number} props.debounceMs - Tiempo de debounce en ms (default: 300)
 */
const SearchBar = ({ placeholder = 'Buscar...', onSearch, debounceMs = 300 }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Efecto con debounce para evitar llamadas excesivas
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onSearch) {
                onSearch(searchTerm);
            }
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [searchTerm, debounceMs, onSearch]);

    const handleClear = () => {
        setSearchTerm('');
    };

    return (
        <div className="search-bar">
            <div className="search-input-wrapper">
                <Search size={20} className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button
                        className="search-clear-btn"
                        onClick={handleClear}
                        aria-label="Limpiar búsqueda"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
