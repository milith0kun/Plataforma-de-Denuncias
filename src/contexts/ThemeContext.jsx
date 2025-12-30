import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * Hook personalizado para usar el contexto de tema
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe usarse dentro de ThemeProvider');
    }
    return context;
};

/**
 * Provider del contexto de tema
 * Maneja el estado global del tema (claro/oscuro)
 */
export const ThemeProvider = ({ children }) => {
    // Obtener tema guardado en localStorage o usar 'light' por defecto
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });

    // Aplicar tema al documento y guardar en localStorage
    useEffect(() => {
        // Aplicar clase al elemento raíz
        document.documentElement.setAttribute('data-theme', theme);

        // Guardar preferencia
        localStorage.setItem('theme', theme);
    }, [theme]);

    /**
     * Alternar entre tema claro y oscuro
     */
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    /**
     * Establecer un tema específico
     * @param {string} newTheme - 'light' o 'dark'
     */
    const setThemeMode = (newTheme) => {
        if (newTheme === 'light' || newTheme === 'dark') {
            setTheme(newTheme);
        }
    };

    const value = {
        theme,
        toggleTheme,
        setThemeMode,
        isDark: theme === 'dark'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
