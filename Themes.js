import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const AppColors = {
    primary: '#359fbd',
    light: '#57B5CF',
    extralight: '#86CEE2',
    dark: '#168CAD',
    extradark: '#046C8A',
    error: '#ab1b27',
    warning: '#d19900',
    success: '#05ab3f',
    subtle: 'gray',
    darkText: DefaultTheme.colors.text,
    lightText: DarkTheme.colors.text,
}

const DarkThemeColors = {
    ...DarkTheme.colors,
    ...AppColors,
    
    // lighter colors for more contrast
    primary2: '#57B5CF',
    primary3: '#86CEE2',

    subtitle: '#8a8a8a',
    lightBackground: '#242424'
}

const LightThemeColors = {
    ...DefaultTheme.colors,
    ...AppColors,

    // darker colors for more contrast
    primary2: '#168CAD',
    primary3: '#046C8A',

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