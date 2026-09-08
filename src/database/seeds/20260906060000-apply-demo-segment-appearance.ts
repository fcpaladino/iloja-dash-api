import { QueryInterface } from "sequelize";

type DemoAppearance = {
  subdomain: string;
  primary: string;
  secondary: string;
  themeMode: "light" | "dark";
  darkBackground: string;
  backgroundBannerStyle: string;
  headerBackgroundColor: string;
  backgroundIconPattern: string;
  backgroundIconColor: string;
  backgroundIconOpacity: number;
  productCardType: "right_square" | "left_square" | "top_square" | "compact" | "detailed" | "grid";
};

/**
 * Aparência das lojas demo, usando os mesmos valores disponíveis em
 * Admin > Config. empresa > Aparência > Plano de fundo.
 *
 * Esta seed é separada da criação do catálogo porque os campos de aparência
 * foram adicionados depois das primeiras seeds de demonstração.
 */
const demos: DemoAppearance[] = [
  {
    subdomain: "demo-mercado",
    primary: "#15803D",
    secondary: "#FACC15",
    themeMode: "light",
    darkBackground: "#102A1B",
    backgroundBannerStyle: "cart",
    headerBackgroundColor: "#14532D",
    backgroundIconPattern: "mercado",
    backgroundIconColor: "#15803D",
    backgroundIconOpacity: 0.16,
    productCardType: "right_square",
  },
  {
    subdomain: "demo-sacolao",
    primary: "#65A30D",
    secondary: "#F97316",
    themeMode: "light",
    darkBackground: "#1A2E05",
    backgroundBannerStyle: "nature",
    headerBackgroundColor: "#365314",
    backgroundIconPattern: "sacolao",
    backgroundIconColor: "#65A30D",
    backgroundIconOpacity: 0.18,
    productCardType: "grid",
  },
  {
    subdomain: "demo-petshop",
    primary: "#7C3AED",
    secondary: "#F59E0B",
    themeMode: "light",
    darkBackground: "#2E1065",
    backgroundBannerStyle: "pets",
    headerBackgroundColor: "#4C1D95",
    backgroundIconPattern: "petshop",
    backgroundIconColor: "#7C3AED",
    backgroundIconOpacity: 0.15,
    productCardType: "top_square",
  },
  {
    subdomain: "demo-moda",
    primary: "#BE185D",
    secondary: "#F9A8D4",
    themeMode: "light",
    darkBackground: "#500724",
    backgroundBannerStyle: "fashion",
    headerBackgroundColor: "#831843",
    backgroundIconPattern: "moda",
    backgroundIconColor: "#BE185D",
    backgroundIconOpacity: 0.14,
    productCardType: "detailed",
  },
  {
    subdomain: "demo-eletronicos",
    primary: "#1D4ED8",
    secondary: "#06B6D4",
    themeMode: "dark",
    darkBackground: "#0F172A",
    backgroundBannerStyle: "tech",
    headerBackgroundColor: "#172554",
    backgroundIconPattern: "eletronicos",
    backgroundIconColor: "#38BDF8",
    backgroundIconOpacity: 0.18,
    productCardType: "compact",
  },
  {
    subdomain: "demo-farmacia",
    primary: "#0F766E",
    secondary: "#5EEAD4",
    themeMode: "light",
    darkBackground: "#042F2E",
    backgroundBannerStyle: "health",
    headerBackgroundColor: "#115E59",
    backgroundIconPattern: "farmacia",
    backgroundIconColor: "#0F766E",
    backgroundIconOpacity: 0.15,
    productCardType: "left_square",
  },
];

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.transaction(async transaction => {
      for (const demo of demos) {
        await queryInterface.bulkUpdate(
          "Company",
          {
            colorPrimary: demo.primary,
            colorSecondary: demo.secondary,
            themeMode: demo.themeMode,
            darkBackground: demo.darkBackground,
            backgroundBannerStyle: demo.backgroundBannerStyle,
            headerBackgroundColor: demo.headerBackgroundColor,
            backgroundIconPattern: demo.backgroundIconPattern,
            backgroundIconColor: demo.backgroundIconColor,
            backgroundIconOpacity: demo.backgroundIconOpacity,
            productCardType: demo.productCardType,
            updatedAt: new Date(),
          },
          { subdomain: demo.subdomain },
          { transaction },
        );
      }
    });
  },

  down: async () => null,
};
