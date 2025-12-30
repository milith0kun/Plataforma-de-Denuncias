import { useState } from 'react';
import { Filter } from 'lucide-react';
import './FilterPanel.css';

/**
 * Componente de panel de filtros para denuncias
 * @param {Object} props
 * @param {Function} props.onFilterChange - Callback con los filtros seleccionados
 * @param {Object} props.initialFilters - Filtros iniciales
 */
const FilterPanel = ({ onFilterChange, initialFilters = {} }) => {
    const [filters, setFilters] = useState({
        estado: initialFilters.estado || 'todos',
        categoria: initialFilters.categoria || 'todas',
        fechaDesde: initialFilters.fechaDesde || '',
        fechaHasta: initialFilters.fechaHasta || ''
    });

    const estados = [
        { value: 'todos', label: 'Todos los Estados' },
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'en_proceso', label: 'En Proceso' },
        { value: 'resuelta', label: 'Resuelta' },
        { value: 'cerrada', label: 'Cerrada' }
    ];

    const categorias = [
        { value: 'todas', label: 'Todas las Categorías' },
        { value: 'baches', label: '🚧 Baches' },
        { value: 'basura', label: '🗑️ Basura' },
        { value: 'alumbrado', label: '💡 Alumbrado' },
        { value: 'agua', label: '💧 Agua' },
        { value: 'trafico', label: '🚦 Tráfico' },
        { value: 'ruido', label: '🔊 Ruido' },
        { value: 'otros', label: '📌 Otros' }
    ];

    const handleChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);

        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    const handleReset = () => {
        const resetFilters = {
            estado: 'todos',
            categoria: 'todas',
            fechaDesde: '',
            fechaHasta: ''
        };
        setFilters(resetFilters);

        if (onFilterChange) {
            onFilterChange(resetFilters);
        }
    };

    // Contar filtros activos (excepto 'todos' y 'todas')
    const activeFiltersCount = Object.values(filters).filter(
        (value, index) => {
            if (index === 0) return value !== 'todos';
            if (index === 1) return value !== 'todas';
            return value !== '';
        }
    ).length;

    return (
        <div className="filter-panel">
            <div className="filter-header">
                <div className="filter-title">
                    <Filter size={20} />
                    <span>Filtros</span>
                    {activeFiltersCount > 0 && (
                        <span className="filter-badge">{activeFiltersCount}</span>
                    )}
                </div>
                {activeFiltersCount > 0 && (
                    <button
                        className="filter-reset-btn"
                        onClick={handleReset}
                    >
                        Limpiar
                    </button>
                )}
            </div>

            <div className="filter-grid">
                {/* Filtro por Estado */}
                <div className="filter-group">
                    <label htmlFor="estado-filter" className="filter-label">
                        Estado
                    </label>
                    <select
                        id="estado-filter"
                        className="filter-select"
                        value={filters.estado}
                        onChange={(e) => handleChange('estado', e.target.value)}
                    >
                        {estados.map(estado => (
                            <option key={estado.value} value={estado.value}>
                                {estado.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro por Categoría */}
                <div className="filter-group">
                    <label htmlFor="categoria-filter" className="filter-label">
                        Categoría
                    </label>
                    <select
                        id="categoria-filter"
                        className="filter-select"
                        value={filters.categoria}
                        onChange={(e) => handleChange('categoria', e.target.value)}
                    >
                        {categorias.map(categoria => (
                            <option key={categoria.value} value={categoria.value}>
                                {categoria.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro por Fecha Desde */}
                <div className="filter-group">
                    <label htmlFor="fecha-desde-filter" className="filter-label">
                        Fecha Desde
                    </label>
                    <input
                        id="fecha-desde-filter"
                        type="date"
                        className="filter-input"
                        value={filters.fechaDesde}
                        onChange={(e) => handleChange('fechaDesde', e.target.value)}
                    />
                </div>

                {/* Filtro por Fecha Hasta */}
                <div className="filter-group">
                    <label htmlFor="fecha-hasta-filter" className="filter-label">
                        Fecha Hasta
                    </label>
                    <input
                        id="fecha-hasta-filter"
                        type="date"
                        className="filter-input"
                        value={filters.fechaHasta}
                        onChange={(e) => handleChange('fechaHasta', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
