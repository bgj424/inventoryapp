import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const AppColors = {
    light: '#46aacb',
    error: '#ab1b27',
    warning: '#d19900',
    success: '#00e384',
}

export const InventoryAppDark = {
    dark: true,
    colors: {
        ...DarkTheme.colors,
        ...AppColors,
        primary: '#359fbd',
        subtitle: '#8a8a8a',
        lightBackground: '#242424',
    },
}

export const InventoryAppLight = {
    dark: false,
    colors: {
        ...DefaultTheme.colors,
        ...AppColors,
        primary: '#359fbd',
        subtitle: '#636363',
        lightBackground: '#d1d1d1',
    },
}