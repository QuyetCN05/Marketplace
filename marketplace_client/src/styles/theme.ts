import { NextUIPluginConfig, ThemeColors } from "@nextui-org/react"

export const colors: Partial<ThemeColors> = {
  primary: {
    100: "#FCDED1",
    200: "#FAB7A5",
    300: "#F18576",
    400: "#E35652",
    500: "#D1202B",
    600: "#B3172F",
    700: "#961030",
    800: "#790A2E",
    900: "#64062D",
    DEFAULT: "#D1202B",
  },
  secondary: {
    100: "#8CBEF0",
    200: "#81B8EF",
    300: "#74B1ED",
    400: "#66A9EB",
    500: "#57A0E9",
    600: "#4696E7",
    700: "#348CE5",
    800: "#2081E2",
    900: "#1D75CD",
    DEFAULT: "#4696E7",
  },
}

export const theme: NextUIPluginConfig = {
  themes: {
    light: {
      colors,
    },
  },
}
