"use client";

import { Box, Container, Flex, Link, List, SimpleGrid, Text } from "@chakra-ui/react";

const BRAND_NAME = "Legacy Immortal";
const BRAND_INITIALS = "LI";
const DESCRIPTION =
   "A self-sovereign archive for your memories, stories, and digital assets. Signed by you, replicated to peers you trust, and readable long after any single server is gone.";
const COPYRIGHT = "© 2026 Legacy Immortal. All rights reserved.";
const CLOSING_NOTE = "No algorithms. No data sales. No expiration dates.";

const PRODUCT_LINKS = [
   { label: "Features", href: "#features" },
   { label: "Concept", href: "#concept" },
   { label: "Principles", href: "#what-we-are" },
   { label: "Pricing", href: "#pricing" },
   { label: "Early Access", href: "#invitation" },
] as const;

export function Footer() {
   return (
      <Box as="footer" mt="auto" data-footer="true">
         <Container maxW="container.xl" px={{ base: "5", md: "8" }} py={{ base: "12", md: "16" }}>
            <SimpleGrid columns={{ base: 1, md: 4 }} gap={{ base: "10", md: "8" }}>
               <Box gridColumn={{ base: "1", md: "span 2" }}>
                  <Flex align="center" gap="2.5" mb="4">
                     <Box as="span" className="brand__stamp" aria-hidden="true">
                        {BRAND_INITIALS}
                     </Box>
                     <Box as="span" className="footer__title">
                        {BRAND_NAME}
                     </Box>
                  </Flex>
                  <Text className="footer__note" mb="5">
                     {DESCRIPTION}
                  </Text>
                  <Text className="footer__note" color="fg.subtle">
                     {CLOSING_NOTE}
                  </Text>
               </Box>

               <Box>
                  <Box as="h3" className="footer__heading" mb="4">
                     Explore
                  </Box>
                  <List.Root display="flex" flexDirection="column" gap="2.5">
                     {PRODUCT_LINKS.map((link) => (
                        <List.Item key={link.href}>
                           <Link href={link.href} className="footer__link">
                              {link.label}
                           </Link>
                        </List.Item>
                     ))}
                  </List.Root>
               </Box>
            </SimpleGrid>

            <Flex
               mt={{ base: "10", md: "14" }}
               pt="6"
               direction={{ base: "column", md: "row" }}
               justify="space-between"
               align={{ base: "flex-start", md: "center" }}
               gap="3"
            >
               <Text color="fg.subtle" fontSize="sm">
                  {COPYRIGHT}
               </Text>
               <Text color="fg.subtle" fontSize="sm">
                  Self-host it, or let us host it.
               </Text>
            </Flex>
         </Container>
      </Box>
   );
}
