import * as React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "@tanstack/react-router";
import { ColorModeProvider } from "./components/ui/theme/color-mode";
import { getRouter } from "./router";
import { aboutSystem } from "./components/about/theme/aboutTheme";
import "./styles/about/about.css";
import "./styles/about/aboutFonts.css";
import "./styles/about/surreal-animations.css";

const root = createRoot(document.getElementById("root")!);
root.render(
   <ChakraProvider value={aboutSystem}>
      <ColorModeProvider>
         <RouterProvider router={getRouter()} />
      </ColorModeProvider>
   </ChakraProvider>
);