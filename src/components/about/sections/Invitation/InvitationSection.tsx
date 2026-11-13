"use client";

import { Box, Container, Grid, GridItem, VStack } from "@chakra-ui/react";
import { Component, type ReactNode } from "react";
import { AboutHeading } from "../../ui/Heading";
import { AboutText } from "../../ui/Text";
import { SectionIntro } from "../../ui/SectionIntro";
import InvitationForm from "./InvitationForm";
import { loadContent, readString } from "../../lib/contentLoader";
import { stripFleuron } from "../../lib/fleuron";

const loaded = loadContent();
const invitation = loaded.invitation?.frontmatter;

const COPY = {
   title: readString(invitation, "title", "Early Access ❧"),
   description: readString(invitation, "description", ""),
   formHeading: stripFleuron(readString(invitation, "formHeading", "Get your invite keys")),
   dailyLimitHeading: stripFleuron(readString(invitation, "dailyLimitHeading", "Keys per Invite")),
   dailyLimitValue: readString(invitation, "dailyLimitValue", "5"),
   dailyLimitSubtext: stripFleuron(
      readString(invitation, "dailyLimitSubtext", "Keys per invite"),
   ),
   dailyLimitReset: stripFleuron(readString(invitation, "dailyLimitReset", "Resets midnight UTC")),
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
               <AboutHeading as="h2" color="fg">
                  The form could not be loaded
               </AboutHeading>
               <AboutText as="p" mt="3" color="fg.muted">
                  Refresh the page to try again, or write to us and we will send your
                  keys by hand.
               </AboutText>
            </Box>
         );
      }

      return this.props.children;
   }
}

export function InvitationSection() {
   return (
      <ErrorBoundary>
         <Box as="section" id="invitation" className="section section--sunk">
            <Container maxW="container.xl" px={{ base: "5", md: "8" }}>
               <VStack align="stretch" gap={{ base: "10", md: "14" }}>
                  <SectionIntro title={COPY.title} lede={COPY.description} />

                  <Grid
                     templateColumns={{ base: "1fr", lg: "minmax(0, 7fr) minmax(0, 5fr)" }}
                     gap={{ base: "6", lg: "8" }}
                     alignItems="stretch"
                  >
                     <GridItem>
                        <Box className="invite-card">
                           <AboutHeading as="h3" className="invite-card__title">
                              {COPY.formHeading}
                           </AboutHeading>
                           <InvitationForm />
                        </Box>
                     </GridItem>

                     <GridItem>
                        <Box className="invite-stub">
                           <AboutHeading as="h3" className="invite-card__title">
                              {COPY.dailyLimitHeading}
                           </AboutHeading>
                           <Box className="invite-stub__count">{COPY.dailyLimitValue}</Box>
                           <AboutText as="p" className="invite-stub__label">
                              {COPY.dailyLimitSubtext} — five at a time, for you and up to four
                              friends.
                           </AboutText>
                           {COPY.dailyLimitReset ? (
                              <Box as="p" className="invite-stub__reset">
                                 {COPY.dailyLimitReset}
                              </Box>
                           ) : null}
                        </Box>
                     </GridItem>
                  </Grid>
               </VStack>
            </Container>
         </Box>
      </ErrorBoundary>
   );
}
