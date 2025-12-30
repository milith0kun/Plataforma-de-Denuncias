import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

/**
 * Componente Toggle para cambiar entre tema claro y oscuro
 */
const ThemeToggle = () => {
    const { theme, toggleTheme, isDark } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
            title={`Modo ${isDark ? 'claro' : 'oscuro'}`}
        >
            <div className="theme-toggle-icon">
                {isDark ? (
                    <Sun size={20} className="sun-icon" />
                ) : (
                    <Moon size={20} className="moon-icon" />
                )}
            </div>
            <span className="theme-toggle-label">
                {isDark ? 'Claro' : 'Oscuro'}
            </span>
        </button>
    );
};

export default ThemeToggle;
