import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const AppColors = {
    light: '#46aacb',
    error: '#ab1b27',
    warning: '#d19900',
    success: '#05ab3f',
    darkText: DefaultTheme.colors.text,
    lightText: DarkTheme.colors.text,
}

const DarkThemeColors = {
    ...DarkTheme.colors,
    ...AppColors,
    primary: '#359fbd',
    subtitle: '#8a8a8a',
    lightBackground: '#242424'
}

const LightThemeColors = {
    ...DefaultTheme.colors,
    ...AppColors,
    primary: '#359fbd',
    subtitle: '#636363',
    lightBackground: '#d1d1d1',
}

export const InventoryAppDark = {
    dark: true,
    colors: {
        ...DarkThemeColors,
        reverse: {
            ...LightThemeColors
        }
    }
}

export const InventoryAppLight = {
    dark: false,
    colors: {
        ...LightThemeColors,
        reverse: {
            ...DarkThemeColors
        }
    }
}