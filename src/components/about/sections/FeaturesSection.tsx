"use client";

import { Box, Container, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { resolveIcon } from "../lib/iconMap";
import { AboutHeading } from "../ui/Heading";
import { AboutText } from "../ui/Text";
import { loadContent } from "../lib/contentLoader";

const content = loadContent();
const features = content.features?.frontmatter || {};

const items: Array<{ title: string; description: string; icon: IconType }> =
   (features.items as Array<{ title: string; description: string; icon: string }> | undefined)?.map(
      (item) => ({
         title: item.title,
         description: item.description,
         icon: resolveIcon(item.icon),
      })
   ) || [];

export function FeaturesSection() {
   return (
      <Box as="section" id="features" pt={{ base: "12", md: "16" }} pb="24">
         <Container maxW="container.xl" px="4">
            <VStack maxW="6xl" mx="auto" gap="16">
               <VStack textAlign="center" mb="12">
                  <AboutHeading
                     color="fg"
                     mb="8"
                     _dark={{ color: "primary.500" }}
                     fontSize={{ base: "4xl", md: "5xl" }}
                     fontWeight="bold"
                     fontFamily="serif"
                  >
                     {features.title || "Permanent digital legacy ❧"}
                  </AboutHeading>
                  <AboutText
                     color="fg"
                     maxW="3xl"
                     mx="auto"
                     _dark={{ color: "fg.muted" }}
                     fontSize="xl"
                  >
                     {features.description || ""}
                  </AboutText>
               </VStack>

               <AboutHeading
                  as="h3"
                  color="fg"
                  _dark={{ color: "primary.500" }}
                  fontSize="xl"
                  fontWeight="semibold"
                  fontFamily="serif"
               >
                  {features.subTitle || "Built for resilience ❧"}
               </AboutHeading>

               <SimpleGrid columns={{ base: 1, lg: 2 }} gap="12">
                  {items.map((item) => {
                     const ItemIcon = item.icon;
                     return (
                        <Box key={item.title} p="8">
                           <HStack align="flex-start" gap="4">
                              <Box flexShrink="0">
                                 <Box
                                    width="12"
                                    height="12"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    color="fg"
                                    _dark={{ color: "primary.500" }}
                                 >
                                    <ItemIcon size={40} aria-hidden />
                                 </Box>
                              </Box>
                              <VStack align="flex-start" gap="3">
                                 <AboutHeading
                                    as="h3"
                                    color="fg"
                                    mb="3"
                                    _dark={{ color: "primary.500" }}
                                    fontSize="xl"
                                    fontWeight="semibold"
                                    fontFamily="serif"
                                 >
                                    {item.title}
                                 </AboutHeading>
                                 <AboutText
                                    color="fg"
                                    lineHeight="relaxed"
                                    _dark={{ color: "fg.muted" }}
                                 >
                                    {item.description}
                                 </AboutText>
                              </VStack>
                           </HStack>
                        </Box>
                     );
                  })}
               </SimpleGrid>
            </VStack>
         </Container>
      </Box>
   );
}
