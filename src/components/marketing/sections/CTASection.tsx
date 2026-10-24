"use client";

import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { Button } from "../ui/Button";

const COPY = {
   title: "Reclaim Your Digital Legacy ❧",
   description:
      "Join the pre-alpha and begin reclaiming your digital story. Design your first memorial, create your first time capsule, or import your archive. Your legacy starts now.",
   buttonText: "Request Pre-Alpha Access ❧",
   buttonHref: "#invitation",
} as const;

export function CTASection() {
   return (
      <Box as="section" py="24">
         <Container maxW="container.xl" px="4" textAlign="center">
            <VStack maxW="3xl" mx="auto" gap="12">
               <Heading
                  color="fg"
                  mb="8"
                  _dark={{ color: "primary.500" }}
                  fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                  fontWeight="bold"
                  fontFamily="serif"
               >
                  {COPY.title}
               </Heading>
               <Text color="fg" mb="12" _dark={{ color: "fg.muted" }} fontSize="xl">
                  {COPY.description}
               </Text>
               <Button href={COPY.buttonHref} variant="primary" size="lg">
                  {COPY.buttonText}
               </Button>
            </VStack>
         </Container>
      </Box>
   );
}
