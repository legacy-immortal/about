"use client";

import { lazy, Suspense } from "react";
import { Box, Container, Grid, GridItem, HStack, VStack } from "@chakra-ui/react";
import { Button } from "../../ui/Button";
import { AboutHeading } from "../../ui/Heading";
import { AboutText } from "../../ui/Text";
import { loadContent, readString } from "../../lib/contentLoader";
import { stripFleuron } from "../../lib/fleuron";

const NautilusShell = lazy(() => import("./NautilusShell"));

const content = loadContent();
const hero = content.hero?.frontmatter;

export function HeroSection() {
   const title = readString(hero, "title", "Legacy Immortal ❧");
   const subtitle = readString(hero, "subtitle", "Your digital life, preserved — forever.");
   const description = readString(hero, "description", "");
   const primaryText = stripFleuron(readString(hero, "primaryButtonText", "Get early access"));
   const primaryHref = readString(hero, "primaryButtonHref", "#invitation");
   const secondaryText = stripFleuron(
      readString(hero, "secondaryButtonText", "See how it works"),
   );
   const secondaryHref = readString(hero, "secondaryButtonHref", "#features");

   return (
      <Box as="section" className="hero" position="relative" overflow="hidden">
         {/* The shell is the one loud thing on the page: the chambered spiral
             of a growing archive, drawn to the right of the opening words. */}
         <Box
            className="hero__spiral"
            position="absolute"
            inset="0"
            zIndex="0"
            pointerEvents="none"
            data-hero-spiral="true"
         >
            <Suspense fallback={null}>
               <NautilusShell className="w-full h-full" />
            </Suspense>
         </Box>

         <Box position="relative" zIndex="10" data-hero-content>
            <Container maxW="container.xl" px={{ base: "5", md: "8" }}>
               <Grid
                  templateColumns={{ base: "1fr", lg: "minmax(0, 7fr) minmax(0, 5fr)" }}
                  gap="8"
                  alignItems="center"
                  minH={{ base: "auto", lg: "calc(100vh - var(--about-header-h))" }}
                  py={{ base: "20", lg: "28" }}
               >
                  <GridItem>
                     <VStack align="flex-start" gap="6" maxW="38rem" className="hero__copy">
                        <AboutHeading as="h1" className="hero__title">
                           {title}
                        </AboutHeading>

                        <AboutText as="p" className="hero__subtitle">
                           <span>{subtitle}</span>
                        </AboutText>

                        <AboutText as="p" className="hero__description">
                           <span>{description}</span>
                        </AboutText>

                        <HStack gap="3" flexWrap="wrap" pt="2">
                           <Button href={primaryHref} variant="primary" size="md">
                              {primaryText}
                           </Button>
                           <Button href={secondaryHref} variant="outline" size="md">
                              {secondaryText}
                           </Button>
                        </HStack>
                     </VStack>
                  </GridItem>
               </Grid>
            </Container>
         </Box>
      </Box>
   );
}
