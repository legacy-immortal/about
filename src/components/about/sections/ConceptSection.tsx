"use client";

import { Box, Container, VStack } from "@chakra-ui/react";
import { resolveIcon } from "../lib/iconMap";
import { AboutHeading } from "../ui/Heading";
import { AboutText } from "../ui/Text";
import { SectionIntro } from "../ui/SectionIntro";
import { loadContent, readConceptItems, readString } from "../lib/contentLoader";

const content = loadContent();
const concept = content.concept?.frontmatter;
const items = readConceptItems(concept);

export function ConceptSection() {
   return (
      <Box as="section" id="concept" className="section section--sunk">
         <Container maxW="container.xl" px={{ base: "5", md: "8" }}>
            <VStack align="stretch" gap={{ base: "10", md: "14" }}>
               <SectionIntro
                  title={readString(concept, "title", "How it works ❧")}
                  lede={readString(concept, "body", "")}
               />

               <Box className="ledger">
                  {items.map((item) => {
                     const ItemIcon = resolveIcon(item.icon);
                     return (
                        <Box key={item.title} className="ledger-card">
                           <Box className="ledger-card__mark" aria-hidden="true">
                              <ItemIcon size={22} />
                           </Box>
                           <AboutHeading as="h3" className="ledger-card__title">
                              {item.title}
                           </AboutHeading>
                           <AboutText as="p" className="ledger-card__body">
                              {item.description}
                           </AboutText>
                        </Box>
                     );
                  })}
               </Box>
            </VStack>
         </Container>
      </Box>
   );
}
