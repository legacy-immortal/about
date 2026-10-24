"use client";

import { lazy, Suspense } from "react";
import { Box, Container, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Button } from "../../ui/Button";

const NautilusShell = lazy(() => import("./NautilusShell"));

const COPY = {
   title: "Legacy Immortal ❧",
   subtitle: "An infinite, replicating, living archive of your digital legacy ❧",
   description:
      "Sovereign, secure, federated. With self-hosting and peer replication enabled, your archive can outlast any single operator. Hosted-only accounts keep a single origin copy until you add peers.",
   primaryButtonText: "Request Access ❧",
   primaryButtonHref: "#invitation",
   secondaryButtonText: "Learn More ❧",
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
