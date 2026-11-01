"use client";

import { lazy, Suspense } from "react";
import { Box, Container, Flex, VStack } from "@chakra-ui/react";
import { Button } from "../../ui/Button";
import { AboutHeading } from "../../ui/Heading";
import { AboutText } from "../../ui/Text";
import { loadContent } from "../../lib/contentLoader";

const NautilusShell = lazy(() => import("./NautilusShell"));

const content = loadContent();
const hero = content.hero?.frontmatter || {};

export function HeroSection() {
   return (
      <Box
         as="section"
         position="relative"
         minH="100vh"
         display="flex"
         alignItems="center"
         justifyContent="center"
         overflow="hidden"
      >
         <Box position="absolute" inset="0" zIndex="0" pointerEvents="none">
            <Suspense fallback={null}>
               <NautilusShell className="w-full h-full" />
            </Suspense>
         </Box>

         <Box
            position="relative"
            zIndex="10"
            width="100%"
            minH="calc(100vh - 4.5rem)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            data-hero-content
         >
            <Container maxW="container.lg" px="4" textAlign="center">
               <VStack maxW="3xl" mx="auto" gap="8">
                  <AboutHeading
                     as="h1"
                     mb="8"
                     color="fg"
                     _dark={{ color: "fg" }}
                     fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
                     fontWeight="bold"
                     fontFamily="serif"
                     letterSpacing="wider"
                  >
                     {hero.title || "Legacy Immortal ❧"}
                  </AboutHeading>

                  <AboutText
                     mb="6"
                     maxW="xl"
                     mx="auto"
                     lineHeight="relaxed"
                     color="fg"
                     _dark={{ color: "fg" }}
                     fontSize="md"
                  >
                     {hero.subtitle || "Your digital life, preserved — forever."}
                  </AboutText>

                  <AboutText
                     mb="8"
                     maxW="2xl"
                     mx="auto"
                     lineHeight="loose"
                     color="fg"
                     _dark={{ color: "fg.muted" }}
                     fontSize="md"
                  >
                     {hero.description || ""}
                  </AboutText>

                  <Flex
                     direction={{ base: "column", sm: "row" }}
                     gap="4"
                     justify="center"
                     align="center"
                     mb="12"
                  >
                     <Button href={hero.primaryButtonHref || "#invitation"} variant="primary" size="md">
                        {hero.primaryButtonText || "Get Early Access ❧"}
                     </Button>
                     <Button href={hero.secondaryButtonHref || "#features"} variant="outline" size="md">
                        {hero.secondaryButtonText || "See how it works ❧"}
                     </Button>
                  </Flex>
               </VStack>
            </Container>
         </Box>
      </Box>
   );
}
