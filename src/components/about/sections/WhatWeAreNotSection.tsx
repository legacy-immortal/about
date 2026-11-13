"use client";

import { Box, Container, Grid, GridItem, VStack } from "@chakra-ui/react";
import { AboutHeading } from "../ui/Heading";
import { AboutText } from "../ui/Text";
import { loadContent, readString } from "../lib/contentLoader";

const content = loadContent();
const wwan = content["what-we-are-not"]?.frontmatter;

/** The body is authored as two paragraphs separated by a blank line. */
function paragraphs(body: string): string[] {
   return body
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
}

export function WhatWeAreNotSection() {
   const body = readString(wwan, "body", "");

   return (
      <Box as="section" id="what-we-are" className="section">
         <Container maxW="container.xl" px={{ base: "5", md: "8" }}>
            <Grid
               templateColumns={{ base: "1fr", lg: "minmax(0, 5fr) minmax(0, 7fr)" }}
               gap={{ base: "8", lg: "12" }}
               alignItems="start"
            >
               <GridItem>
                  <VStack align="stretch" gap="4">
                     <Box className="section-intro" pt="0">
                        <AboutHeading as="h2" className="section-intro__title">
                           {readString(wwan, "title", "What we are, and what we are not ❧")}
                        </AboutHeading>
                     </Box>
                  </VStack>
               </GridItem>

               <GridItem>
                  <Box className="statement">
                     {paragraphs(body).map((paragraph) => (
                        <AboutText as="p" key={paragraph.slice(0, 24)}>
                           {paragraph}
                        </AboutText>
                     ))}
                  </Box>
               </GridItem>
            </Grid>
         </Container>
      </Box>
   );
}
