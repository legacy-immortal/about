"use client";

import { Box, Container, VStack } from "@chakra-ui/react";
import { AboutHeading } from "../ui/Heading";
import { AboutText } from "../ui/Text";
import { Button } from "../ui/Button";
import { loadContent, readString } from "../lib/contentLoader";
import { stripFleuron } from "../lib/fleuron";

const content = loadContent();
const cta = content.cta?.frontmatter;

export function CTASection() {
   const title = readString(cta, "title", "Build Your Legacy ❧");
   const description = readString(cta, "description", "");
   const buttonText = stripFleuron(readString(cta, "buttonText", "Get invite keys"));
   const buttonHref = readString(cta, "buttonHref", "#invitation");

   return (
      <Box as="section" id="cta" className="section">
         <Container maxW="container.xl" px={{ base: "5", md: "8" }}>
            <Box className="closing-panel">
               <VStack align="flex-start" gap="6" maxW="46rem">
                  <AboutHeading as="h2" className="closing-panel__title">
                     {title}
                  </AboutHeading>
                  <AboutText as="p" className="closing-panel__body">
                     {description}
                  </AboutText>
                  <Button href={buttonHref} variant="primary" size="lg">
                     {buttonText}
                  </Button>
               </VStack>
            </Box>
         </Container>
      </Box>
   );
}
