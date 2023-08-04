import { createContext, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// Color Designs
export const tokens = () => ({

    primary: {
        100: "#d3eefa",
        200: "#a7dcf5",
        300: "#7acbf0",
        400: "#4eb9eb",
        500: "#22a8e6",
        600: "#1b86b8",
        700: "#14658a",
        800: "#0e435c",
        900: "#07222e"
        },
    white: {
        100: "#ffffff", 
        200: "#ffffff",
        300: "#ffffff",
        400: "#ffffff",
        500: "#ffffff",
        600: "#cccccc",
        700: "#999999",
        800: "#666666",
        900: "#333333"
        },
    black: {
        100: "#cccccc",
        200: "#999999",
        300: "#666666",
        400: "#333333",
        500: "#000000",
        600: "#000000",
        700: "#000000",
        800: "#000000",
        900: "#000000"
        },
    gray: {
        100: "#dadbdd",
        200: "#b5b7ba",
        300: "#919498",
        400: "#6c7075",
        500: "#474c53",
        600: "#393d42",
        700: "#2b2e32",
        800: "#1c1e21",
        900: "#0e0f11"
        },
    red: {
        100: "#fad2d4",
        200: "#f5a5a8",
        300: "#ef797d",
        400: "#ea4c51",
        500: "#e51f26",
        600: "#b7191e",
        700: "#891317",
        800: "#5c0c0f",
        900: "#2e0608"
        },
});

export const themeSettings = () => {
    const colors = tokens()

    return {
        palette: {
            
            primary: {
                main: colors.primary[500]
            },
            secondary: {
                main: colors.white[100]
            },
            neutral: {
                dark: colors.gray[700],
                main: colors.gray[500],
                light: colors.gray[100]
            },
            background: {
                default: "#f2f2f2"
            } 
        },
        typography: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Rubik", "sans-serif"].join(","),
                fontSize: 40
            },
            h2: {
                fontFamily: ["Rubik", "sans-serif"].join(","),
                fontSize: 32
            },
            h3: {
                fontFamily: ["Rubik", "sans-serif"].join(","),
                fontSize: 24
            },
            h4: {
                fontFamily: ["Rubik", "sans-serif"].join(","),
                fontSize: 20
            },
            h5 : {
                fontFamily: ["Rubik", "sans-serif"].join(","),
                fontSize: 16,
            },
            h6 : {
                fontFamily: ["Rubik", "sans-serif"].join(","),
                fontSize: 14
            },

        },
    };
};

export const ColorModeContext = createContext({})

export const useMode = () => {
    const theme = useMemo(() => createTheme(themeSettings()), []);
    return [theme, {}];
};