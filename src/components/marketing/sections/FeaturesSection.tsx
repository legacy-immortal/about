"use client";

import { Box, Container, HStack, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { GiLockedChest, GiMartyrMemorial, GiThreeKeys, GiTiedScroll } from "react-icons/gi";

const COPY = {
   title: "Permanent digital legacy ❧",
   subTitle: "Built for permanence ❧",
   description:
      "Legacy Immortal lets you archive, authenticate, and pass on your digital life — photos, writing, messages, and assets — on your own terms. Your content lives in a federated network you control, hosted by you or by us, with no algorithms, no data sales, and no expiration dates.",
   items: [
      {
         title: "Sign & authenticate your content",
         description:
            "Digitally sign photos, writing, posts, and media so every item carries cryptographic proof of authorship — an assertion of authenticity you control, not just an audit trail.",
         icon: GiLockedChest,
      },
      {
         title: "Memorial spaces",
         description:
            "Build permanent memorials with stories, photos, and timelines. Invite family and friends with fine-grained roles (owner, steward, viewer), or keep a space private until you choose.",
         icon: GiMartyrMemorial,
      },
      {
         title: "Digital vault & asset management",
         description:
            "Archive your full digital life in a secure vault with role-based access control. Manage who sees what, when, and under what circumstances.",
         icon: GiThreeKeys,
      },
      {
         title: "Succession & dead man's switches",
         description:
            "Designate successors, set up cryptographic keys, OTPs, and dead man's locks so your assets transfer securely to the people you trust — when it matters.",
         icon: GiTiedScroll,
      },
      {
         title: "Import from anywhere",
         description:
            "Bring your history over from Ghost, WordPress, Substack, Tumblr, Instagram, Facebook archives, Neocities, GEDCOM, RSS, and more — one import, one source of truth.",
         icon: GiLockedChest,
      },
      {
         title: "Peer replication & self-hosting",
         description:
            "Replicate your archive across trusted peers via ActivityPub federation and Hyperdrive P2P mirroring. Self-host on your own hardware or let us host it — permanence through redundancy.",
         icon: GiMartyrMemorial,
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
