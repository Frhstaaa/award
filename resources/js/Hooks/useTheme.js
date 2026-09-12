import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('theme');
                if (stored === 'light' || stored === 'dark') {
                    return stored;
                }
            } catch (e) {
                // Ignore storage error
            }
        }
        return 'dark'; // Default to dark for gala
    });

    // Apply theme class to <html>
    const applyTheme = useCallback((newTheme) => {
        if (typeof window === 'undefined') return;
        const root = document.documentElement;
        if (newTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            // Ignore
        }
        window.dispatchEvent(new CustomEvent('livasya-theme-change', { detail: newTheme }));
    }, []);

    // Set theme and notify
    const setAppTheme = useCallback((newTheme) => {
        setTheme(newTheme);
        applyTheme(newTheme);
    }, [applyTheme]);

    // Toggle between light & dark
    const toggleTheme = useCallback(() => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setAppTheme(nextTheme);
    }, [theme, setAppTheme]);

    useEffect(() => {
        // Apply on initial mount
        applyTheme(theme);

        // Listen for cross-tab or cross-component theme changes
        const handleThemeChange = (e) => {
            if (e.detail && e.detail !== theme) {
                setTheme(e.detail);
            }
        };

        window.addEventListener('livasya-theme-change', handleThemeChange);
        return () => window.removeEventListener('livasya-theme-change', handleThemeChange);
    }, [theme, applyTheme]);

    return {
        theme,
        isDark: theme === 'dark',
        setTheme: setAppTheme,
        toggleTheme,
    };
}
