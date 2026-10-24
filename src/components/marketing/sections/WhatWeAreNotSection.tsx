"use client";

import { mkt } from "~/components/marketing/lib/colors";

import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";

export function WhatWeAreNotSection() {
   return (
      <Box as="section" id="what-we-are-not" py="24" scrollMarginTop="6rem">
         <Container maxW="container.xl" px="4">
            <VStack maxW="3xl" mx="auto" gap="8" align="stretch" textAlign="center">
               <Heading
                  color="fg"
                  _dark={{ color: mkt.primary }}
                  fontSize={{ base: "4xl", md: "5xl" }}
                  fontWeight="bold"
               >
                  What we are and what we are not (work in progress) ❧
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
                     We are not a social media app or network. We see ourselves as apart of a
                     project to reorient society's relationship with death and technology. You are
                     not your browsing history, you are not your medical and biometric data, you are
                     not your Amazon purchases, you are not your viral social media posts, you are
                     not your credit rating, you are not your leaked emails and dms, you are not
                     your 3am searches on PornHub, you are not your breakup messages over FaceBook
                     messenger app from 2016, you are not your Uber or Lyft rides or your shitposts
                     and shower thoughts on Twitter. You will not be survielled, processed, nudged,
                     traded for, geofenced, politically radicalized, min-maxed, upsold, front-loaded,
                     back-propagated through a neural network, or manipulated by brainless
                     algorithms designed to reduce you to data. You are not what Palantir thinks
                     they know about you. You are a human being. Your future should not be decided
                     by corporations or by the government, your past should be preserved as a
                     legacy, as the stories and memories of your life as they are known by you and
                     your friends and family. It is your story to tell. Our belief is that the true
                     horror of death is being forgotten. Thus, what we aim to provide is at once a
                     digital mausoleum and a living memorial. Yes, a tomb but also a gathering
                     place to remember, venerate and celebrate a life.
                  </Text>
               </Box>
            </VStack>
         </Container>
      </Box>
   );
}
