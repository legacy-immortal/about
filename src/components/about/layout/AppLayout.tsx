"use client";

import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface AppLayoutProps {
   children: ReactNode;
}

/**
 * Reserve space for the fixed header so content and the hero spiral start
 * below it. Kept in sync with `--about-header-h` in `styles/about/about.css`.
 */
const HEADER_OFFSET = "4.5rem";

/**
 * About page chrome. Wrapper `data-about-site` scopes `about.css` so the
 * about palette and flat styling do not leak into dashboard routes.
 */
export function AppLayout({ children }: AppLayoutProps) {
   return (
      <div data-about-site="">
         {/* Skip link — keyboard users bypass the header and jump straight to main content. */}
         <a
            href="#main-content"
            className="skip-link"
            tabIndex={0}
         >
            Skip to content
         </a>
         <Header />
         <main id="main-content" style={{ flex: 1, minHeight: "100vh", paddingTop: HEADER_OFFSET }}>{children}</main>
         <Footer />
      </div>
   );
}
