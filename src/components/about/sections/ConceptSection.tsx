"use client";

import { mkt } from "~/components/about/lib/colors";

import { Box, Container, SimpleGrid, VStack } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { resolveIcon } from "../lib/iconMap";
import { AboutHeading } from "../ui/Heading";
import { AboutText } from "../ui/Text";
import { Card } from "../ui/Card";
import { loadContent } from "../lib/contentLoader";

const content = loadContent();
const concept = content.concept?.frontmatter || {};

const items: Array<{ title: string; description: string; icon: IconType }> =
   (concept.items as Array<{ title: string; description: string; icon: string }> | undefined)?.map(
      (item) => ({
         title: item.title,
         description: item.description,
         icon: resolveIcon(item.icon),
      })
   ) || [];

export function ConceptSection() {
   return (
      <Box as="section" id="concept" py="24" scrollMarginTop="6rem">
         <Container maxW="container.xl" px="4">
            <VStack maxW="6xl" mx="auto" gap="16" align="stretch">
               <VStack textAlign="center" gap="6">
                  <AboutHeading color="fg" _dark={{ color: mkt.primary }}>
                     {concept.title || "How it works ❧"}
                  </AboutHeading>
                  <Box
                     maxW="3xl"
                     mx="auto"
                     px={{ base: 4, md: 8 }}
                     py={6}
                     borderWidth="1px"
                     borderColor="var(--about-border)"
                     borderRadius="lg"
                     _dark={{ borderColor: "var(--about-border)", bg: "bg/50" }}
                  >
                     <AboutText
                        color="fg"
                        _dark={{ color: "fg.muted" }}
                        fontSize="lg"
                        lineHeight="relaxed"
                     >
                        {concept.body || ""}
                     </AboutText>
                  </Box>
               </VStack>

               <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 6, lg: 8 }} width="100%">
                  {items.map((item) => (
                     <Card key={item.title} padding="lg" variant="outlined" height="100%">
                        <VStack align="stretch" gap="4" textAlign="left">
                           <AboutHeading
                              as="h3"
                              color="fg"
                              display="flex"
                              alignItems="center"
                              gap="3"
                              _dark={{ color: mkt.accent }}
                              fontSize="lg"
                              fontWeight="semibold"
                              fontFamily="serif"
                           >
                              <Box
                                 as="span"
                                 flexShrink="0"
                                 display="inline-flex"
                                 color="fg"
                                 _dark={{ color: mkt.accent }}
                              >
                                 <item.icon size={40} aria-hidden />
                              </Box>
                              {item.title}
                           </AboutHeading>
                           <AboutText
                              color="fg"
                              _dark={{ color: "fg.muted" }}
                              fontSize="sm"
                              lineHeight="relaxed"
                           >
                              {item.description}
                           </AboutText>
                        </VStack>
                     </Card>
                  ))}
               </SimpleGrid>
            </VStack>
         </Container>
      </Box>
   );
}
