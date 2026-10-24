"use client";

import { Box, Flex, Heading, IconButton, Link } from "@chakra-ui/react";
import { Link as RouterLink, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DASHBOARD_BASEPATH } from "~/constants";
import { Button } from "../ui/Button";
import ThemeSwitcher from "../ui/ThemeSwitcher";

const BRAND_NAME = "Legacy Immortal";
const BRAND_INITIALS = "LI";
const CTA_TEXT = "Get Alpha Access";
const CTA_HREF = "#invitation";

const MARKETING_PATH = "/marketing";

const NAV_LINKS = [
   { label: "Features", href: "#features" },
   { label: "Concept", href: "#concept" },
   { label: "Pricing", href: "#pricing" },
   { label: "Alpha Access", href: "#invitation" },
] as const;

export function Header() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const currentPath = useRouterState({ select: (s) => s.location.pathname });

   const processedNavLinks = useMemo(() => {
      const isMarketingHome =
         currentPath === MARKETING_PATH || currentPath === `${MARKETING_PATH}/`;

      return NAV_LINKS.map((link) => {
         if (link.href.startsWith("#") && !isMarketingHome) {
            return { ...link, href: `${MARKETING_PATH}${link.href}` };
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
                  <RouterLink to={MARKETING_PATH}>
                  <Box
                     width="8"
                     height="8"
                     display="flex"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <Heading
                        as="span"
                        fontSize="sm"
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
                           color="fg"
                           _hover={{
                              color: "fg.muted",
                              textDecoration: "underline",
                              textDecorationColor: "fg.subtle",
                              textUnderlineOffset: "2px",
                           }}
                           _dark={{
                              color: "fg",
                              _hover: { color: "primary.accent", textDecoration: "none" },
                           }}
                           transition="color 0.3s ease, text-decoration 0.3s ease"
                        >
                           {link.label}
                        </Link>
                     ))}
                  </Flex>
               </Box>

               <Flex align="center" gap="3">
                  <ThemeSwitcher />
                  <Box hideBelow="sm">
                     <Link
                        asChild
                        color="fg"
                        fontFamily="mono"
                        fontWeight="semibold"
                        fontSize="sm"
                        _hover={{ color: "fg.muted", textDecoration: "none" }}
                     >
                        <RouterLink to={DASHBOARD_BASEPATH}>Open app</RouterLink>
                     </Link>
                  </Box>
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
                           color="fg"
                           _hover={{
                              color: "fg.muted",
                              textDecoration: "underline",
                              textDecorationColor: "fg.subtle",
                              textUnderlineOffset: "2px",
                           }}
                           _dark={{
                              color: "fg",
                              _hover: { color: "primary.accent", textDecoration: "none" },
                           }}
                           transition="color 0.3s ease, text-decoration 0.3s ease"
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
