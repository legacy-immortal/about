"use client";

import { Box, Container, Flex, SimpleGrid, Span, Text, VStack } from "@chakra-ui/react";
import { LuCheck } from "react-icons/lu";
import { InfoTip } from "~/components/ui/feedback/toggle-tip";
import { Button } from "../ui/Button";
import { Card, CardBody } from "../ui/Card";
import { AboutHeading } from "../ui/Heading";
import { AboutText } from "../ui/Text";
import { SectionIntro } from "../ui/SectionIntro";
import { scrollToSection } from "../lib/scrollToSection";
import { EARLY_ACCESS_ENABLED, loadContent, readPlans, readString, type PlanData } from "../lib/contentLoader";

const content = loadContent();
const pricing = content.pricing?.frontmatter;
const plans = readPlans(pricing);

interface PricingCardProps {
   data: PlanData;
}

function PricingCard({ data }: PricingCardProps) {
   const isRecommended = Boolean(data.recommended);

   return (
      <Card className="tier" padding="none" data-recommended={isRecommended ? "true" : "false"}>
         <CardBody gap="0">
            <VStack align="stretch" gap="0" flex="1">
               <Flex align="baseline" justify="space-between" gap="3">
                  <AboutHeading as="h3" className="tier__title">
                     {data.title}
                  </AboutHeading>
                  {isRecommended ? (
                     <Text className="tier__flag">Recommended</Text>
                  ) : null}
               </Flex>

               <Flex align="baseline" gap="2" pt="3">
                  <Span className="tier__price">
                     {data.priceSymbol}
                     {data.price}
                  </Span>
                  <Span className="tier__unit">/ {data.priceUnit}</Span>
               </Flex>

               <Text className="chakra-text tier__description" pt="3">
                  {data.description}
               </Text>

               <Box pt="5">
                  <Button
                     variant={isRecommended ? "primary" : "outline"}
                     size="md"
                     width="100%"
                     onClick={() => scrollToSection(EARLY_ACCESS_ENABLED ? "invitation" : "pricing")}
                  >
                     {data.callToAction}
                  </Button>
               </Box>

               <Box className="tier__features" mt="5">
                  {data.features.map((item) => (
                     <Flex key={item.label} className="tier__feature">
                        <Box as="span" className="tier__check" aria-hidden="true">
                           <LuCheck size={16} />
                        </Box>
                        <Text as="span">{item.label}</Text>
                        {item.infoText ? <InfoTip>{item.infoText}</InfoTip> : null}
                     </Flex>
                  ))}
               </Box>
            </VStack>
         </CardBody>
      </Card>
   );
}

export function PricingSection() {
   return (
      <Box as="section" id="pricing" className="section">
         <Container maxW="container.xl" px={{ base: "5", md: "8" }}>
            <VStack align="stretch" gap={{ base: "10", md: "14" }}>
               <SectionIntro
                  title={readString(pricing, "title", "Pricing ❧")}
                  lede={readString(pricing, "description", "")}
               />

               <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: "6", md: "8" }}>
                  {plans.map((plan) => (
                     <PricingCard key={plan.value} data={plan} />
                  ))}
               </SimpleGrid>

               <Box className="closing-panel">
                  <Flex
                     direction={{ base: "column", md: "row" }}
                     align={{ base: "flex-start", md: "center" }}
                     justify="space-between"
                     gap="6"
                  >
                     <VStack align="flex-start" gap="2" maxW="40rem">
                        <AboutHeading as="h3" className="tier__title">
                           {readString(pricing, "customPlanTitle", "Need a custom plan?")}
                        </AboutHeading>
                        <AboutText as="p" className="tier__description">
                           {readString(pricing, "customPlanDescription", "")}
                        </AboutText>
                     </VStack>
                     <Button
                        href={EARLY_ACCESS_ENABLED ? "#invitation" : "#cta"}
                        variant="outline"
                        size="md"
                     >
                        {readString(pricing, "customPlanCta", "Reach out")}
                     </Button>
                  </Flex>
               </Box>
            </VStack>
         </Container>
      </Box>
   );
}
