"use client";

import { Box, Container, SimpleGrid, VStack } from "@chakra-ui/react";
import { resolveIcon } from "../lib/iconMap";
import { Card } from "../ui/Card";
import { AboutHeading } from "../ui/Heading";
import { AboutText } from "../ui/Text";
import { SectionIntro } from "../ui/SectionIntro";
import { loadContent, readFeatureItems, readString } from "../lib/contentLoader";

const content = loadContent();
const features = content.features?.frontmatter;
const items = readFeatureItems(features);

export function FeaturesSection() {
   return (
      <Box as="section" id="features" className="section">
         <Container maxW="container.xl" px={{ base: "5", md: "8" }}>
            <VStack align="stretch" gap={{ base: "10", md: "14" }}>
               <SectionIntro
                  title={readString(features, "title", "Permanent digital legacy ❧")}
                  kicker={readString(features, "subTitle", "Built for resilience ❧")}
                  lede={readString(features, "description", "")}
               />

               <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={{ base: "6", md: "8" }}>
                  {items.map((item) => {
                     const ItemIcon = resolveIcon(item.icon);
                     return (
                        <Card key={item.title} className="index-card" padding="none">
                           <Box className="index-card__stamp" aria-hidden="true">
                              <ItemIcon size={24} />
                           </Box>
                           <AboutHeading as="h3" className="index-card__title">
                              {item.title}
                           </AboutHeading>
                           <AboutText as="p" className="index-card__body">
                              {item.description}
                           </AboutText>
                        </Card>
                     );
                  })}
               </SimpleGrid>
            </VStack>
         </Container>
      </Box>
   );
}
