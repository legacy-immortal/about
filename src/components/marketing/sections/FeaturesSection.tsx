"use client";

import { Box, Container, HStack, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { GiLockedChest, GiMartyrMemorial, GiThreeKeys, GiTiedScroll } from "react-icons/gi";

const COPY = {
   title: "What is Legacy Immortal? ❧",
   subTitle: "Features ❧",
   description:
      "Legacy Immortal is a project to reclaim your digital identity (our memories, stories, experiences, etc. stored as images, videos, text, etc..., that is to say, your stuff) as a legacy, not as data. We are an experiment in achieving immortality, not through the false transhumanist promise of eternal life, but through community, memory and cooperation. Our platform allows you to digitally sign your photos, videos, posts, social media content, etc. and authenticate them as your own. With our digital asset management system you can control who sees what, when under what circumstances. Your stuff (your photos, videos, posts, social media content, etc.) will live on a node in a federated private social network of your own creation, hosted either by you on your own computer or by us. It is a secret and secure vault reinforced by your social graph: the more connections you make, the more friends and family you bring on, the more permanence and resilience your stuff has. It's preservation becomes a collective effort and responsibility. Our promise: No algorithms, no selling data, no expiration dates. Your activity is undersigned and authenticated with your signature as an assertion of it's authenticity not an audit trail. You decide who, when, and how other users can interact with you and your stuff. Hosted accounts start with a single origin copy; peer replication and self-hosting unlock the full permanence story.",
   items: [
      {
         title: "Time Capsules ❧",
         description:
            "Schedule content to unlock at specific dates, anniversaries, or life events. Create personalized content that activates and releases in a certain sequence or order at a special time or event.",
         icon: GiTiedScroll,
      },
      {
         title: "Memorial Pages ❧",
         description:
            "Build a permanent memorial with stories, photos, and timelines. Share with family and friends, or keep it private until a moment of your choosing.",
         icon: GiMartyrMemorial,
      },
      {
         title: "Digital Vault ❧",
         description:
            "Import and preserve everything with our digital asset management system. Connect your social accounts, archive your digital life, and maintain a single source of truth for your legacy.",
         icon: GiLockedChest,
      },
      {
         title: "Succession & Keys ❧",
         description:
            "Designate successors, create cryptographic keys, OTPs, and deadman's locks for your stuff. Ensure your digital assets transfer securely to the right people at the right time. No, you can't take it with you but you can give it to those you trust.",
         icon: GiThreeKeys,
      },
   ] satisfies Array<{ title: string; description: string; icon: IconType }>,
} as const;

export function FeaturesSection() {
   return (
      <Box as="section" id="features" pt={{ base: "12", md: "16" }} pb="24">
         <Container maxW="container.xl" px="4">
            <VStack maxW="6xl" mx="auto" gap="16">
               <VStack textAlign="center" mb="12">
                  <Heading
                     color="fg"
                     mb="8"
                     _dark={{ color: "primary.500" }}
                     fontSize={{ base: "4xl", md: "5xl" }}
                     fontWeight="bold"
                  >
                     {COPY.title}
                  </Heading>
                  <Text color="fg" maxW="3xl" mx="auto" _dark={{ color: "fg.muted" }} fontSize="xl">
                     {COPY.description}
                  </Text>
               </VStack>

               <Heading
                  as="h3"
                  color="fg"
                  _dark={{ color: "primary.500" }}
                  fontSize="xl"
                  fontWeight="semibold"
               >
                  {COPY.subTitle}
               </Heading>

               <SimpleGrid columns={{ base: 1, lg: 2 }} gap="12">
                  {COPY.items.map((item) => {
                     const ItemIcon = item.icon;
                     return (
                        <Box key={item.title} p="8">
                           <HStack align="flex-start" gap="4">
                              <Box flexShrink="0">
                                 <Box
                                    width="12"
                                    height="12"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    color="fg"
                                    _dark={{ color: "primary.500" }}
                                 >
                                    <ItemIcon size={24} aria-hidden />
                                 </Box>
                              </Box>
                              <VStack align="flex-start" gap="3">
                                 <Heading
                                    as="h3"
                                    color="fg"
                                    mb="3"
                                    _dark={{ color: "primary.500" }}
                                    fontSize="xl"
                                    fontWeight="semibold"
                                 >
                                    {item.title}
                                 </Heading>
                                 <Text
                                    color="fg"
                                    lineHeight="relaxed"
                                    _dark={{ color: "fg.muted" }}
                                 >
                                    {item.description}
                                 </Text>
                              </VStack>
                           </HStack>
                        </Box>
                     );
                  })}
               </SimpleGrid>
            </VStack>
         </Container>
      </Box>
   );
}
