"use client";

import { mkt } from "~/components/about/lib/colors";

import { Box, Container, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { Component, type ReactNode } from "react";
import { Card } from "../../ui/Card";
import InvitationForm from "./InvitationForm";
import { loadContent } from "../../lib/contentLoader";

const loaded = loadContent();
const invitation = loaded.invitation?.frontmatter || {};

const COPY = {
   title: invitation.title || "Early Access ❧",
   description: invitation.description || "",
   formHeading: invitation.formHeading || "Get Your Invite Keys ❧",
   dailyLimitHeading: invitation.dailyLimitHeading || "Keys per Invite ❧",
   dailyLimitValue: invitation.dailyLimitValue || "5",
   dailyLimitSubtext: invitation.dailyLimitSubtext || "Keys per invite ❧",
   dailyLimitReset: invitation.dailyLimitReset || "Resets midnight UTC ❧",
} as const;

class ErrorBoundary extends Component<
   { children: ReactNode },
   { hasError: boolean; error?: Error }
> {
   constructor(props: { children: ReactNode }) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
   }

   componentDidCatch(error: Error, errorInfo: unknown) {
      console.error("InvitationSection error:", error, errorInfo);
   }

   render() {
      if (this.state.hasError) {
         return (
            <Box p="8" textAlign="center">
               <Heading color="red.500">Something went wrong</Heading>
               <Text mt="4">{this.state.error?.message}</Text>
            </Box>
         );
      }

      return this.props.children;
   }
}

export function InvitationSection() {
   return (
      <ErrorBoundary>
         <Box as="section" id="invitation" pt="24" pb="24" scrollMarginTop="6rem" width="100%">
            <Container maxW="container.xl" px="4" marginInline="auto">
               <VStack maxW="4xl" mx="auto" gap="12" width="100%" align="stretch">
                  <VStack textAlign="center" mb="12" gap="8" width="100%">
                     <Heading
                        className="animate-scroll-deblur"
                        style={{ animationDelay: "0.2s" }}
                        color="fg"
                        mb="6"
                        _dark={{ color: "primary.500" }}
                        fontSize={{ base: "4xl", md: "6xl" }}
                         fontFamily="serif"
                        fontWeight="bold"
                        lineHeight="1.2"
                        letterSpacing="normal"
                     >
                        {COPY.title}
                     </Heading>
                     <Text
                        className="animate-scroll-deblur"
                        color="fg"
                        mb="8"
                        maxW="2xl"
                        mx="auto"
                        _dark={{ color: "fg.muted" }}
                        fontSize="xl"
                         lineHeight="1.6"
                     >
                        {COPY.description}
                     </Text>
                  </VStack>

                  <SimpleGrid
                     columns={{ base: 1, lg: 3 }}
                     gap="8"
                     mb="12"
                     width="100%"
                     alignItems="stretch"
                     justifyItems={{ base: "stretch", lg: "center" }}
                  >
                     <Box
                        gridColumn={{ base: "1", lg: "span 2" }}
                        display="flex"
                        justifyContent="center"
                        width="100%"
                     >
                        <Card
                           padding="lg"
                           textAlign="center"
                           width="100%"
                           maxW={{ lg: "2xl" }}
                           display="flex"
                           flexDirection="column"
                           borderWidth="1px"
                           borderColor="var(--about-border)"
                           variant="default"
                           className="polaroid-card animate-scroll-deblur"
                           style={{ animationDelay: "0.2s" }}
                        >
                           <Heading
                              as="h2"
                              color="fg"
                              mb="6"
                           fontFamily="serif"
                              _dark={{ color: "primary.500" }}
                              fontSize="2xl"
                              fontWeight="bold"
                           >
                              {COPY.formHeading}
                           </Heading>
                           <InvitationForm />
                        </Card>
                     </Box>

                     <VStack
                        gap="6"
                        align="stretch"
                        flex="1"
                        minW="0"
                        width="100%"
                        alignItems="center"
                     >
                        <Card
                           padding="lg"
                           textAlign="center"
                           height="100%"
                           width="100%"
                           maxW={{ lg: "sm" }}
                           display="flex"
                           flexDirection="column"
                           justifyContent="center"
                           borderWidth="1px"
                           borderColor="var(--about-border)"
                           variant="outlined"
                           className="polaroid-card animate-scroll-deblur"
                           style={{ animationDelay: "0.5s" }}
                        >
                           <Heading
                              as="h3"
                              color="fg"
                           fontFamily="serif"
                              mb="4"
                              _dark={{ color: "primary.500" }}
                              fontSize="lg"
                              fontWeight="semibold"
                           >
                              {COPY.dailyLimitHeading}
                           </Heading>
                           <VStack gap="2">
                              <Text
                                 color="fg"
                                 mb="2"
                                 _dark={{ color: "primary.500" }}
                                 fontSize="3xl"
                                 fontWeight="bold"
                              >
                                 {COPY.dailyLimitValue}
                              </Text>
                              <Text color="fg" fontSize="sm" _dark={{ color: "fg.muted" }}>
                                 {COPY.dailyLimitSubtext}
                              </Text>
                              {COPY.dailyLimitReset && (
                                 <Text mt="3" fontSize="xs" color="fg" _dark={{ color: "fg.muted" }}>
                                    {COPY.dailyLimitReset}
                                 </Text>
                              )}
                           </VStack>
                        </Card>
                     </VStack>
                  </SimpleGrid>
               </VStack>
            </Container>
         </Box>
      </ErrorBoundary>
   );
}
