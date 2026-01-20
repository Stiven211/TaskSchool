import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './button';
import { useTheme } from '../../../hooks/useTheme';

export function ThemeToggle() {
    const [theme, setTheme] = useTheme();

    const cycleTheme = () => {
        if (theme === 'auto') setTheme('light');
        else if (theme === 'light') setTheme('dark');
        else setTheme('auto');
    };

    const getIcon = () => {
        if (theme === 'light') return <Sun className="w-4 h-4" />;
        if (theme === 'dark') return <Moon className="w-4 h-4" />;
        return <Monitor className="w-4 h-4" />;
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            className="w-8 h-8 p-0"
            title={`Tema actual: ${theme}. Haz clic para cambiar.`}
        >
            {getIcon()}
        </Button>
    );
}