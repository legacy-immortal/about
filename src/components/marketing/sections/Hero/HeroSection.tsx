"use client";

import { lazy, Suspense } from "react";
import { Box, Container, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Button } from "../../ui/Button";

const NautilusShell = lazy(() => import("./NautilusShell"));

const COPY = {
   title: "Legacy Immortal ❧",
   subtitle: "Your digital life, preserved — forever.",
   description:
      "A self-sovereign archive for your memories, stories, and digital assets. Sign and authenticate your content, designate successors, and replicate across peers so your legacy outlives any single server. No algorithms. No data sales. No expiration dates.",
   primaryButtonText: "Request Pre-Alpha Access ❧",
   primaryButtonHref: "#invitation",
   secondaryButtonText: "See how it works ❧",
   secondaryButtonHref: "#features",
} as const;

export function HeroSection() {
   return (
      <Box
         as="section"
         position="relative"
         minH="100vh"
         display="flex"
         alignItems="center"
         justifyContent="center"
         overflow="hidden"
      >
         <Box position="absolute" inset="0" zIndex="0" pointerEvents="none">
            <Suspense fallback={null}>
               <NautilusShell className="w-full h-full" />
            </Suspense>
         </Box>

         <Box
            position="relative"
            zIndex="10"
            width="100%"
            minH="calc(100vh - 4.5rem)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            data-hero-content
         >
            <Container maxW="container.lg" px="4" textAlign="center">
               <VStack maxW="3xl" mx="auto" gap="8">
                  <Heading
                     as="h1"
                     mb="8"
                     color="fg"
                     _dark={{ color: "fg" }}
                     fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
                     fontFamily="serif"
                     fontWeight="bold"
                     letterSpacing="wider"
                  >
                     {COPY.title}
                  </Heading>

                  <Text
                     mb="6"
                     maxW="xl"
                     mx="auto"
                     lineHeight="relaxed"
                     color="fg"
                     _dark={{ color: "fg" }}
                     fontSize="md"
                  >
                     {COPY.subtitle}
                  </Text>

                  <Text
                     mb="8"
                     maxW="2xl"
                     mx="auto"
                     lineHeight="loose"
                     color="fg"
                     _dark={{ color: "fg.muted" }}
                     fontSize="md"
                  >
                     {COPY.description}
                  </Text>

                  <Flex
                     direction={{ base: "column", sm: "row" }}
                     gap="4"
                     justify="center"
                     align="center"
                     mb="12"
                  >
                     <Button href={COPY.primaryButtonHref} variant="primary" size="md">
                        {COPY.primaryButtonText}
                     </Button>
                     <Button href={COPY.secondaryButtonHref} variant="outline" size="md">
                        {COPY.secondaryButtonText}
                     </Button>
                  </Flex>
               </VStack>
            </Container>
         </Box>
      </Box>
   );
}
