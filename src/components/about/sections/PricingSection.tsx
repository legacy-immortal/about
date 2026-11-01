"use client";

import type { StackProps } from "@chakra-ui/react";
import {
   Box,
   Card,
   Container,
   Flex,
   List,
   Separator,
   SimpleGrid,
   Span,
   Stack,
   VStack,
} from "@chakra-ui/react";
import { LuCheck, LuPhone } from "react-icons/lu";
import { InfoTip } from "~/components/ui/feedback/toggle-tip";
import { Button } from "../ui/Button";
import { AboutHeading } from "../ui/Heading";
import { AboutText } from "../ui/Text";
import { loadContent } from "../lib/contentLoader";

const content = loadContent();
const pricing = content.pricing?.frontmatter || {};

interface PlanFeature {
   label: string;
   infoText?: string;
}

interface PlanData {
   value: string;
   title: string;
   description: string;
   features: PlanFeature[];
   priceCurrency: string;
   priceSymbol: string;
   price: number;
   priceUnit: string;
   recommended?: boolean;
   callToAction?: string;
}

const plans: PlanData[] = (pricing.plans as PlanData[] | undefined) || [];

interface PricingCardProps extends StackProps {
   data: PlanData;
}

function PricingCard({ data, ...rest }: PricingCardProps) {
   const isRecommended = data.recommended;
   return (
      <Card.Root
         variant={isRecommended ? "outline" : "subtle"}
         borderWidth="1px"
         borderColor="var(--about-border)"
         bg="var(--about-bg)"
         _dark={
            data.recommended
               ? { borderColor: "primary.500", bg: "transparent" }
               : { bg: "transparent" }
         }
         {...rest}
      >
         <Card.Body>
            <Stack gap="6" pb="6">
               <Card.Title
                  color={isRecommended ? "primary.500" : "fg"}
                  _dark={data.recommended ? undefined : { color: "fg" }}
                  fontFamily="serif"
               >
                  {data.title}
               </Card.Title>
               <Flex gap="1" align="flex-end">
                  <Span
                     fontSize={{ base: "3xl", md: "4xl" }}
                     lineHeight="1"
                     fontWeight="bold"
                     color="fg"
                  >
                     {data.priceSymbol}
                     {data.price}
                  </Span>
                  <Span fontSize="lg" color="fg.muted">
                     / {data.priceUnit}
                  </Span>
               </Flex>
               <Button href="#invitation" variant={isRecommended ? "primary" : "outline"}>
                  {data.callToAction}
               </Button>
               <Card.Description color="fg.muted" minH="2lh" fontSize="sm">
                  {data.description}
               </Card.Description>
            </Stack>
            <Separator variant="dashed" borderColor="var(--about-border)" _dark={{ borderColor: "var(--about-border)" }} />
            <List.Root variant="plain" align="center" fontSize="sm" gap="3" pt="6">
               {data.features.map((item) => (
                  <List.Item key={item.label} alignItems="center" display="flex" gap="2">
                     <List.Indicator
                        asChild
                        color={isRecommended ? "primary.500" : "fg.muted"}
                        _dark={isRecommended ? { color: "primary.accent" } : undefined}
                     >
                        <LuCheck />
                     </List.Indicator>
                     <Span color="fg" _dark={{ color: "fg.muted" }}>
                        {item.label}
                     </Span>
                     {item.infoText != null && item.infoText !== "" && (
                        <InfoTip>{item.infoText}</InfoTip>
                     )}
                  </List.Item>
               ))}
            </List.Root>
         </Card.Body>
      </Card.Root>
   );
}

export function PricingSection() {
   return (
      <Box as="section" id="pricing" py={{ base: "12", md: "24" }}>
         <Container maxW="6xl" px="4">
            <VStack gap="16">
               <VStack maxW="xl" mx="auto" gap="4" textAlign="center">
                  <AboutHeading
                     as="h2"
                     fontWeight="bold"
                     color="fg"
                     _dark={{ color: "primary.500" }}
                     fontSize={{ base: "4xl", md: "5xl" }}
                  >
                     {pricing.title || "Pricing ❧"}
                  </AboutHeading>
                  <AboutText color="fg.muted" maxW="lg" _dark={{ color: "fg.muted" }} fontSize="lg">
                     {pricing.description || ""}
                  </AboutText>
               </VStack>

               <VStack gap="20" w="full">
                  <SimpleGrid w="full" columns={{ base: 1, md: 3 }} gap="6">
                     {plans.map((plan) => (
                        <PricingCard key={plan.value} data={plan} />
                     ))}
                  </SimpleGrid>
                  <Card.Root
                     variant="outline"
                     maxW="2xl"
                     mx="auto"
                     w="full"
                     borderWidth="1px"
                     borderColor="var(--about-border)"
                     _dark={{ borderColor: "var(--about-border)" }}
                  >
                     <Card.Body
                        gap="3"
                        flexDirection={{ base: "column", md: "row" }}
                        alignItems={{ md: "center" }}
                        justifyContent="space-between"
                     >
                        <Stack maxW="xs" gap="1">
                           <Card.Title color="fg" _dark={{ color: "fg" }} fontFamily="serif">
                              {pricing.customPlanTitle || "Need a custom plan?"}
                           </Card.Title>
                           <Card.Description color="fg.muted" _dark={{ color: "fg.muted" }}>
                              {pricing.customPlanDescription || ""}
                           </Card.Description>
                        </Stack>
                        <Button href="#invitation" variant="outline">
                           <LuPhone
                              style={{
                                 marginRight: "0.5rem",
                                 display: "inline-block",
                                 verticalAlign: "middle",
                              }}
                           />
                           {pricing.customPlanCta || "Reach out ❧"}
                        </Button>
                     </Card.Body>
                  </Card.Root>
               </VStack>
            </VStack>
         </Container>
      </Box>
   );
}
