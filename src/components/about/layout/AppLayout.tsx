"use client";

import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface AppLayoutProps {
   children: ReactNode;
}

/** Reserve space for fixed header so content and hero spiral start below it. */
const HEADER_OFFSET = "4.5rem";

/**
 * About page chrome. Wrapper `data-about-site` scopes `about.css` so flat
 * Solarized styling does not leak into dashboard routes (see scoped `*` rules in CSS).
 */
export function AppLayout({ children }: AppLayoutProps) {
   return (
      <div data-about-site="">
         <Header />
         <main style={{ flex: 1, minHeight: "100vh", paddingTop: HEADER_OFFSET }}>{children}</main>
         <Footer />
      </div>
   );
}
