"use client";

import { mkt } from "~/components/marketing/lib/colors";

import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";

export function WhatWeAreNotSection() {
   return (
      <Box as="section" id="what-we-are" py="24" scrollMarginTop="6rem">
         <Container maxW="container.xl" px="4">
            <VStack maxW="3xl" mx="auto" gap="8" align="stretch" textAlign="center">
               <Heading
                  color="fg"
                  _dark={{ color: mkt.primary }}
                  fontSize={{ base: "4xl", md: "5xl" }}
                  fontWeight="bold"
               >
                  What we are, and what we are not ❧
               </Heading>
               <Box
                  maxW="3xl"
                  mx="auto"
                  px={{ base: 4, md: 8 }}
                  py={6}
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="lg"
                  _dark={{ borderColor: "fg.subtle", bg: "bg/50" }}
                  textAlign="left"
               >
                  <Text color="fg" _dark={{ color: "fg.muted" }} fontSize="lg" lineHeight="relaxed">
                     We are not a social media app, and we are not a data broker. Your browsing
                     history, your purchases, your messages, your photos — these are not products
                     to be sold, mined, or monetized. You will not be surveilled, nudged, traded
                     for, geofenced, radicalized, upsold, or manipulated by algorithms designed to
                     reduce you to a data point.
                  </Text>
                  <Text color="fg" _dark={{ color: "fg.muted" }} fontSize="lg" lineHeight="relaxed">
                     We believe the true horror of death is being forgotten. So we build something
                     different: a digital mausoleum and a living memorial. A place to preserve your
                     stories and memories as they are known by you, your friends, and your family —
                     your story, told on your terms, passed to the people you love.
                  </Text>
               </Box>
            </VStack>
         </Container>
      </Box>
   );
}
