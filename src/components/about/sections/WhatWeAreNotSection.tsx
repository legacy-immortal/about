"use client";

import { Box, Container, VStack } from "@chakra-ui/react";
import { AboutHeading } from "../ui/Heading";
import { AboutText } from "../ui/Text";
import { loadContent } from "../lib/contentLoader";

const content = loadContent();
const wwan = content["what-we-are-not"]?.frontmatter || {};

export function WhatWeAreNotSection() {
   return (
      <Box as="section" id="what-we-are" py="32" scrollMarginTop="6rem">
         <Container maxW="container.xl" px="4">
            <VStack maxW="5xl" mx="auto" gap="12" align="stretch" textAlign="center">
               <AboutHeading
                  color="fg"
                  _dark={{ color: "fg" }}
                  fontSize={{ base: "5xl", md: "7xl" }}
                  fontWeight="bold"
                  fontFamily="serif"
                  letterSpacing="normal"
                  lineHeight="1.3"
               >
                  {wwan.title || "What we are, and what we are not ❧"}
               </AboutHeading>
               <Box
                  maxW="4xl"
                  mx="auto"
                  px={{ base: 4, md: 8 }}
                  py={8}
                  borderWidth="1px"
                  borderColor="var(--about-border)"
                  borderRadius="xl"
                  _dark={{ borderColor: "var(--about-border)", bg: "bg/50" }}
                  textAlign="left"
               >
                  <VStack gap="6">
                     <AboutText color="fg" _dark={{ color: "fg.muted" }} fontSize="lg" lineHeight="1.8">
                        {wwan.body || ""}
                     </AboutText>
                  </VStack>
               </Box>
            </VStack>
         </Container>
      </Box>
   );
}
