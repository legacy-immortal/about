import * as React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { RouterProvider } from "@tanstack/react-router";
import { ColorModeProvider } from "./components/ui/theme/color-mode";
import { getRouter } from "./router";
import "./styles/about/about.css";
import "./styles/about/aboutFonts.css";

const root = createRoot(document.getElementById("root")!);
root.render(
   <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
         <RouterProvider router={getRouter()} />
      </ColorModeProvider>
   </ChakraProvider>
);