import * as React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles/marketing/marketing.css";
import "./styles/marketing/marketingFonts.css";

const root = createRoot(document.getElementById("root")!);
root.render(<RouterProvider router={getRouter()} />);