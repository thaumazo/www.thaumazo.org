import theme from "./src/config/theme";


let fontPrimary, fontPrimaryType, fontSecondary, fontSecondaryType;
if (theme.fonts.font_family.primary) {
  fontPrimary = theme.fonts.font_family.primary
    .replace(/\+/g, " ")
    .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;.]+/gi, "");
  fontPrimaryType = theme.fonts.font_family.primary_type;
}
if (theme.fonts.font_family.secondary) {
  fontSecondary = theme.fonts.font_family.secondary
    .replace(/\+/g, " ")
    .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;.]+/gi, "");
  fontSecondaryType = theme.fonts.font_family.secondary_type;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/custom/**/*.{js,ts,jsx,tsx}",
    "../kenstack/src/**/*.{js,ts,jsx,tsx}",
    "./src/content/**/*.{md,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  // safelist: [{ pattern: /^swiper-/ }],
  darkMode: "class",
  theme: {
    screens: {
      sm: "540px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        text: theme.colors.default.text_color.default,
        light: theme.colors.default.text_color.light,
        dark: theme.colors.default.text_color.dark,
        primary: theme.colors.default.theme_color.primary,
        secondary: theme.colors.default.theme_color.secondary,
        body: theme.colors.default.theme_color.body,
        border: theme.colors.default.theme_color.border,
        "theme-light": theme.colors.default.theme_color.theme_light,
        "theme-dark": theme.colors.default.theme_color.theme_dark,
        darkmode: {
          text: theme.colors.darkmode.text_color.default,
          light: theme.colors.darkmode.text_color.light,
          dark: theme.colors.darkmode.text_color.dark,
          primary: theme.colors.darkmode.theme_color.primary,
          secondary: theme.colors.darkmode.theme_color.secondary,
          body: theme.colors.darkmode.theme_color.body,
          border: theme.colors.darkmode.theme_color.border,
          "theme-light": theme.colors.darkmode.theme_color.theme_light,
          "theme-dark": theme.colors.darkmode.theme_color.theme_dark,
        },
      },
      fontSize: {
      },
      fontFamily: {
        primary: [fontPrimary, fontPrimaryType],
        secondary: [fontSecondary, fontSecondaryType],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-bootstrap-grid")({
      generateContainer: false,
      gridGutterWidth: "2rem",
      gridGutters: {
        1: "0.25rem",
        2: "0.5rem",
        3: "1rem",
        4: "1.5rem",
        5: "3rem",
      },
    }),
  ],
};
