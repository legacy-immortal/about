"use client";

import { Box, Flex, Heading, IconButton, Link } from "@chakra-ui/react";
import { Link as RouterLink, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "../ui/Button";
import ThemeSwitcher from "../ui/ThemeSwitcher";

const BRAND_NAME = "Legacy Immortal";
const BRAND_INITIALS = "LI";
const CTA_TEXT = "Get Invite Keys ❧";
const CTA_HREF = "#invitation";

const ABOUT_PATH = "/";

const NAV_LINKS = [
   { label: "Features", href: "#features" },
   { label: "Concept", href: "#concept" },
   { label: "Pricing", href: "#pricing" },
   { label: "Early Access", href: "#invitation" },
] as const;

export function Header() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const currentPath = useRouterState({ select: (s) => s.location.pathname });

   const processedNavLinks = useMemo(() => {
      const isAboutHome =
         currentPath === ABOUT_PATH || currentPath === `${ABOUT_PATH}/`;

      return NAV_LINKS.map((link) => {
         if (link.href.startsWith("#") && !isAboutHome) {
            return { ...link, href: `${ABOUT_PATH}${link.href}` };
         }
         return link;
      });
   }, [currentPath]);

   return (
      <Box
         as="header"
         position="fixed"
         top="0"
         width="100%"
         zIndex="50"
         backdropFilter="blur(12px)"
         bg="bg"
         _dark={{ bg: "bg" }}
         data-header="true"
      >
         <Box maxW="container.xl" mx="auto" px="4" py="4">
            <Flex as="nav" align="center" justify="space-between">
               <Link
                  asChild
                  display="flex"
                  alignItems="center"
                  gap="2"
                  textDecoration="none"
                  _hover={{ textDecoration: "none", opacity: 0.7 }}
                  _dark={{ _hover: { opacity: 0.9 } }}
                  transition="opacity 0.3s ease"
               >
                  <RouterLink to={ABOUT_PATH}>
                  <Box
                     width="8"
                     height="8"
                     display="flex"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Heading
                        as="span"
                        fontSize="xl"
                        fontWeight="bold"
                        color="fg"
                        _dark={{ color: "primary.500" }}
                     >
                        {BRAND_INITIALS}
                     </Heading>
                  </Box>
                  <Heading
                     as="span"
                     fontSize="xl"
                     fontWeight="bold"
                     color="fg"
                     _dark={{ color: "primary.500" }}
                  >
                     {BRAND_NAME}
                  </Heading>
                  </RouterLink>
               </Link>

               <Box hideBelow="md">
                  <Flex align="center" gap="8">
                     {processedNavLinks.map((link) => (
                        <Link
                           key={link.href}
                           href={link.href}
                           className="surreal-link animate-simple-fade-in"
                           style={{ animationDelay: "0.1s" }}
                           color="fg"
                           _hover={{ color: "fg.muted" }}
                           _dark={{ color: "fg", _hover: { color: "primary.accent" } }}
                           transition="color 0.4s ease"
                        >
                           {link.label}
                        </Link>
                     ))}
                  </Flex>
               </Box>

               <Flex align="center" gap="3">
                  <ThemeSwitcher />
                  <Button href={CTA_HREF} variant="cta" size="md" px="6" py="2">
                     {CTA_TEXT}
                  </Button>

                  <Box hideFrom="md">
                     <IconButton
                        id="mobile-menu-button"
                        aria-label="Toggle mobile menu"
                        variant="ghost"
                        color="fg"
                        _dark={{ color: "primary.500" }}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                     >
                        <svg
                           width="24"
                           height="24"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 6h16M4 12h16M4 18h16"
                           />
                        </svg>
                     </IconButton>
                  </Box>
               </Flex>
            </Flex>

            {mobileMenuOpen ? (
               <Box hideFrom="md" mt="4" pb="4" pt="4">
                  <Flex direction="column" gap="4">
                     {processedNavLinks.map((link) => (
                        <Link
                           key={link.href}
                           href={link.href}
                           className="surreal-link animate-simple-fade-in"
                           style={{ animationDelay: "0.1s" }}
                           color="fg"
                           _hover={{ color: "fg.muted" }}
                           _dark={{ color: "fg", _hover: { color: "primary.accent" } }}
                           transition="color 0.4s ease"
                        >
                           {link.label}
                        </Link>
                     ))}
                  </Flex>
               </Box>
            ) : null}
         </Box>
      </Box>
   );
}
