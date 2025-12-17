/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    presets: [require('nativewind/preset')],
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: [
        "./App.tsx",
        "./src/components/**/*.{js,jsx,ts,tsx}",
        "./src/app/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                mj: {
                    blue: {
                        DEFAULT: "#3A6FF8",
                        light: "#5B8DFA",
                        50: "#F0F4FF",
                        100: "#E6ECFF",
                        200: "#CDD9FF",
                        300: "#A3BFFF",
                        400: "#7099FF",
                        500: "#3A6FF8",
                        600: "#2557E0",
                        700: "#1A42B8",
                        800: "#133294",
                        900: "#0E2470",
                    },
                    teal: {
                        DEFAULT: "#6FD0C5",
                        light: "#8DDDD3",
                        50: "#F0FDFB",
                        100: "#E0FBF7",
                        200: "#C1F7EF",
                        300: "#9BEDE3",
                        400: "#6FD0C5",
                        500: "#4CB8AD",
                        600: "#3A9B91",
                        700: "#2D7D75",
                        800: "#236460",
                        900: "#1C4F4C",
                    },
                    yellow: {
                        DEFAULT: "#FBCB43",
                        light: "#FDD76A",
                        50: "#FFFBF0",
                        100: "#FFF7E0",
                        200: "#FEEFC1",
                        300: "#FDE79B",
                        400: "#FCDB6C",
                        500: "#FBCB43",
                        600: "#E5B12D",
                        700: "#C6941F",
                        800: "#A07618",
                        900: "#7D5C13",
                    },
                },

                "mj-bg": {
                    white: "#FFFFFF",
                    light: "#F7F9FC",
                    blue: "#E6ECF5",
                    lavender: "#F3F0FF",
                },

                "mj-text": {
                    main: "#121826",
                    secondary: "#5A6275",
                    muted: "#9E9E9E",
                },

                // Majestor States
                "mj-error": "#E94F37",
                "mj-success": "#6FD0C5",
                "mj-warning": "#FBCB43",
            },

            borderRadius: {
                sm: 6,
                md: 10,
                lg: 12,
                xl: 16,
                "2xl": 20,
                "3xl": 24,
            },

            fontWeight: {
                normal: "400",
                medium: "500",
                semibold: "600",
                bold: "700",
            },

            fontSize: {
                xs: 12,
                sm: 14,
                base: 16,
                lg: 18,
                xl: 20,
                "2xl": 24,
                "3xl": 30,
                "4xl": 36,
                "5xl": 48,
            },

            boxShadow: {
                blue: "0 10 20 0 rgba(58, 111, 248, 0.25)",
                teal: "0 10 20 0 rgba(111, 208, 197, 0.25)",
                authcard: "0 2 12 0 rgba(0,0,0,0.3)"
            }
        },
    },
    plugins: [],
};