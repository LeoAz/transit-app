import { type ResolvedAppearance, type Appearance, type UseAppearanceReturn } from '@/types';

let currentAppearance: Appearance = 'light';

const prefersDark = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = (): Appearance => {
    return 'light';
};

const isDarkMode = (appearance: Appearance): boolean => {
    return false;
};

const applyTheme = (appearance: Appearance): void => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

const mediaQuery = (): MediaQueryList | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = (): void => applyTheme(currentAppearance);

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    currentAppearance = 'light';
    applyTheme(currentAppearance);
}

export function useAppearance(): UseAppearanceReturn {
    const appearance: Appearance = 'light';

    const resolvedAppearance: ResolvedAppearance = 'light';

    const updateAppearance = (mode: Appearance): void => {
        // Mode light forced
    };

    return { appearance, resolvedAppearance, updateAppearance } as const;
}
