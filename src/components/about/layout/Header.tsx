"use client";

import { Box, Flex, IconButton, Link } from "@chakra-ui/react";
import { Link as RouterLink, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "../ui/Button";
import ThemeSwitcher from "../ui/ThemeSwitcher";

const BRAND_NAME = "Legacy Immortal";
const BRAND_INITIALS = "LI";
const CTA_TEXT = "Get invite keys";
const CTA_HREF = "#invitation";

const ABOUT_PATH = "/";

const NAV_LINKS = [
   { label: "Features", href: "#features" },
   { label: "Concept", href: "#concept" },
   { label: "Principles", href: "#what-we-are" },
   { label: "Pricing", href: "#pricing" },
   { label: "Early Access", href: "#invitation" },
] as const;

export function Header() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const currentPath = useRouterState({ select: (s) => s.location.pathname });

   const processedNavLinks = useMemo(() => {
      const isAboutHome = currentPath === ABOUT_PATH || currentPath === `${ABOUT_PATH}/`;

      return NAV_LINKS.map((link) => {
         if (link.href.startsWith("#") && !isAboutHome) {
            return { ...link, href: `${ABOUT_PATH}${link.href}` };
         }
         return link;
      });
   }, [currentPath]);

   const navLink = (label: string, href: string, key: string) => (
      <Link
         key={key}
         href={href}
         className="nav-link"
         color="fg"
         _hover={{ color: "fg" }}
         transition="color 0.18s ease"
      >
         {label}
      </Link>
   );

   return (
      <Box
         as="header"
         position="fixed"
         top="0"
         width="100%"
         zIndex="50"
         data-header="true"
      >
         <Box maxW="container.xl" mx="auto" px={{ base: "5", md: "8" }} py="3">
            <Flex as="nav" align="center" justify="space-between" gap="6">
               <Link
                  asChild
                  className="brand"
                  textDecoration="none"
                  _hover={{ textDecoration: "none" }}
               >
                  <RouterLink to={ABOUT_PATH}>
                     <Box as="span" className="brand__stamp" aria-hidden="true">
                        {BRAND_INITIALS}
                     </Box>
                     <Box as="span" className="brand__name">
                        {BRAND_NAME}
                     </Box>
                  </RouterLink>
               </Link>

               <Box hideBelow="md">
                  <Flex align="center" gap="7">
                     {processedNavLinks.map((link) =>
                        navLink(link.label, link.href, link.href),
                     )}
                  </Flex>
               </Box>

               <Flex align="center" gap="3">
                  <ThemeSwitcher />
                  <Button href={CTA_HREF} variant="cta" size="sm">
                     {CTA_TEXT}
                  </Button>

                  <Box hideFrom="md">
                     <IconButton
                        id="mobile-menu-button"
                        aria-label="Toggle mobile menu"
                        variant="ghost"
                        color="fg"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                     >
                        <Box as="span" className="menu-bars" aria-hidden="true">
                           <span />
                           <span />
                           <span />
                        </Box>
                     </IconButton>
                  </Box>
               </Flex>
            </Flex>

            {mobileMenuOpen ? (
               <Box hideFrom="md" mt="4" pb="2" pt="4">
                  <Flex direction="column" gap="3">
                     {processedNavLinks.map((link) =>
                        navLink(link.label, link.href, `mobile-${link.href}`),
                     )}
                  </Flex>
               </Box>
            ) : null}
         </Box>
      </Box>
   );
}
