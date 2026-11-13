"use client";

import { Box, Grid, GridItem } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { AboutHeading } from "./Heading";
import { AboutText } from "./Text";

export interface SectionIntroProps {
   /** Section title, set in the serif display face. */
   title: ReactNode;
   /** Short italic line that qualifies the title. */
   kicker?: ReactNode;
   /** The lede paragraph that explains the section. */
   lede?: ReactNode;
   children?: ReactNode;
}

/**
 * Section header used across the about site.
 *
 * The rule above the title is the page's structural device: it marks the
 * start of an entry the way a rule marks the start of a catalogue record.
 * The title sits in the left column, the lede in the right — the page reads
 * like an index rather than a stack of centred marketing blocks.
 */
export function SectionIntro({ title, kicker, lede, children }: SectionIntroProps) {
   return (
      <Box className="section-intro">
         <Grid
            templateColumns={{ base: "1fr", lg: "minmax(0, 5fr) minmax(0, 7fr)" }}
            gap={{ base: "6", lg: "12" }}
            alignItems="start"
         >
            <GridItem>
               <AboutHeading as="h2" className="section-intro__title">
                  {title}
               </AboutHeading>
               {kicker ? (
                  <AboutText as="p" className="section-intro__kicker">
                     {kicker}
                  </AboutText>
               ) : null}
            </GridItem>
            {lede ? (
               <GridItem>
                  <AboutText as="p" className="section-intro__lede">
                     {lede}
                  </AboutText>
               </GridItem>
            ) : null}
         </Grid>
         {children}
      </Box>
   );
}

export default SectionIntro;
