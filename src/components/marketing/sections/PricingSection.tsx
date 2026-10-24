"use client";

import type { StackProps } from "@chakra-ui/react";
import {
   Box,
   Card,
   Container,
   Flex,
   Heading,
   List,
   Separator,
   SimpleGrid,
   Span,
   Stack,
   Text,
   VStack,
} from "@chakra-ui/react";
import { LuCheck, LuPhone } from "react-icons/lu";
import { InfoTip } from "~/components/ui/feedback/toggle-tip";
import { Button } from "../ui/Button";

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

const COPY = {
   title: "Pricing ❧",
   description:
      "Choose how you want to host and preserve your archive. The free tier is self-hosted — resilience, permanence, and redundancy are yours to manage. Paid tiers add hosted storage, automated backups, and priority support.",
   plans: [
      {
         value: "free",
         title: "Free ❧",
         description:
            "Self-hosted on your own storage. We provide the sovereignty and federation tools; you manage backup, durability, and redundancy.",
         features: [
            {
               label: "Self-hosted archive",
               infoText: "Backup and durability are your responsibility",
            },
            {
               label: "Sovereignty & federation tools included",
            },
            {
               label: "Import from any supported platform",
            },
            {
               label: "Export your archive anytime",
            },
         ],
         priceCurrency: "US",
         priceSymbol: "$",
         price: 0,
         priceUnit: "month",
         callToAction: "Start for free ❧",
      },
      {
         value: "vault",
         title: "Vault ❧",
         description:
            "We host your archive with baseline resilience and redundancy — ideal for personal legacies.",
         features: [
            {
               label: "50GB fast storage, 500GB cold storage",
               infoText: "We replicate and back up your data across multiple regions",
            },
            { label: "Scheduled automated backups" },
            { label: "Baseline resilience & redundancy" },
            { label: "Priority support & assistance" },
         ],
         priceCurrency: "US",
         priceSymbol: "$",
         price: 20,
         priceUnit: "month",
         recommended: true,
         callToAction: "Get started ❧",
      },
      {
         value: "archive",
         title: "Archive ❧",
         description:
            "Maximum resilience, permanence, and redundancy with generous storage — for families, estates, and long-term legacies.",
         features: [
            {
               label: "500GB fast storage, 5000GB cold storage",
               infoText: "Multi-region replication",
            },
            { label: "Maximum resilience & redundancy" },
            { label: "Dedicated account support & assistance" },
            { label: "Multi-region replication" },
         ],
         priceCurrency: "US",
         priceSymbol: "$",
         price: 50,
         priceUnit: "month",
         callToAction: "Get started ❧",
      },
   ] satisfies PlanData[],
   customPlanTitle: "Need a custom plan?",
   customPlanDescription:
      "We offer custom pricing for institutions and large estates. Tell us about your needs.",
   customPlanCta: "Reach out ❧",
} as const;

interface PricingCardProps extends StackProps {
   data: PlanData;
}

function PricingCard({ data, ...rest }: PricingCardProps) {
   return (
      <Card.Root
         variant={data.recommended ? "outline" : "subtle"}
         borderWidth="1px"
         borderColor="border"
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
                  color={data.recommended ? "primary.500" : "fg"}
                  _dark={data.recommended ? undefined : { color: "fg" }}
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
               <Button href="#invitation" variant={data.recommended ? "primary" : "outline"}>
                  {data.callToAction}
               </Button>
               <Card.Description color="fg.muted" minH="2lh" fontSize="sm">
                  {data.description}
               </Card.Description>
            </Stack>
            <Separator variant="dashed" borderColor="border" _dark={{ borderColor: "fg.subtle" }} />
            <List.Root variant="plain" align="center" fontSize="sm" gap="3" pt="6">
               {data.features.map((item) => (
                  <List.Item key={item.label} alignItems="center" display="flex" gap="2">
                     <List.Indicator
                        asChild
                        color={data.recommended ? "primary.500" : "fg.muted"}
                        _dark={data.recommended ? { color: "primary.accent" } : undefined}
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
                  <Heading
                     as="h2"
                     fontWeight="bold"
                     color="fg"
                     _dark={{ color: "primary.500" }}
                     fontSize={{ base: "4xl", md: "5xl" }}
                  >
                     {COPY.title}
                  </Heading>
                  <Text color="fg.muted" maxW="lg" _dark={{ color: "fg.muted" }} fontSize="lg">
                     {COPY.description}
                  </Text>
               </VStack>

               <VStack gap="20" w="full">
                  <SimpleGrid w="full" columns={{ base: 1, md: 3 }} gap="6">
                     {COPY.plans.map((plan) => (
                        <PricingCard key={plan.value} data={plan} />
                     ))}
                  </SimpleGrid>
                  <Card.Root
                     variant="outline"
                     maxW="2xl"
                     mx="auto"
                     w="full"
                     borderWidth="1px"
                     borderColor="border"
                     _dark={{ borderColor: "fg.subtle" }}
                  >
                     <Card.Body
                        gap="3"
                        flexDirection={{ base: "column", md: "row" }}
                        alignItems={{ md: "center" }}
                        justifyContent="space-between"
                     >
                        <Stack maxW="xs" gap="1">
                           <Card.Title color="fg" _dark={{ color: "fg" }}>
                              {COPY.customPlanTitle}
                           </Card.Title>
                           <Card.Description color="fg.muted" _dark={{ color: "fg.muted" }}>
                              {COPY.customPlanDescription}
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
                           {COPY.customPlanCta}
                        </Button>
                     </Card.Body>
                  </Card.Root>
               </VStack>
            </VStack>
         </Container>
      </Box>
   );
}
