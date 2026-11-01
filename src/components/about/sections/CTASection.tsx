"use client";

import { Box, Container, SimpleGrid, VStack } from "@chakra-ui/react";
import { AboutHeading } from "../ui/Heading";
import { AboutText } from "../ui/Text";
import { Button } from "../ui/Button";
import { loadContent } from "../lib/contentLoader";

const content = loadContent();
const cta = content.cta?.frontmatter || {};

export function CTASection() {
   return (
      <Box as="section" id="cta" py="24">
         <Container maxW="container.xl" px="4" textAlign="center">
            <VStack maxW="3xl" mx="auto" gap="12">
               <AboutHeading
                  color="fg"
                  mb="8"
                  _dark={{ color: "primary.500" }}
                  fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                  fontWeight="bold"
                  fontFamily="serif"
               >
                  {cta.title || "Build Your Legacy ❧"}
               </AboutHeading>
               <AboutText color="fg" mb="12" _dark={{ color: "fg.muted" }} fontSize="xl">
                  {cta.description || ""}
               </AboutText>
               <Button href={cta.buttonHref || "#invitation"} variant="primary" size="lg">
                  {cta.buttonText || "Get Invite Keys ❧"}
               </Button>
            </VStack>
         </Container>
      </Box>
   );
}
