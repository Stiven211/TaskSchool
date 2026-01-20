import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

type Theme = 'auto' | 'light' | 'dark';

export function useTheme() {
    const [theme, setTheme] = useLocalStorage<Theme>('taskSchool_theme', 'auto');

    useEffect(() => {
        const root = document.documentElement;

        const applyTheme = () => {
            const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (isDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        applyTheme();

        // Listen for changes in prefers-color-scheme if theme is 'auto'
        if (theme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme();
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    return [theme, setTheme] as const;
}