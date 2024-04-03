import { Advent_Pro, Roboto_Flex } from "next/font/google";

export const robotoFlex = Roboto_Flex({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-body",
});

export const adventPro = Advent_Pro({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-title",
});
