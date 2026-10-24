"use client";

import { mkt } from "~/components/about/lib/colors";

import { Box, Container, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import {
   GiKey,
   GiLockedDoor,
   GiLockers,
   GiLockPicking,
   GiScrollQuill,
} from "react-icons/gi";
import { Card } from "../ui/Card";

export function ConceptSection() {
   return (
      <Box as="section" id="concept" py="24" scrollMarginTop="6rem">
         <Container maxW="container.xl" px="4">
            <VStack maxW="6xl" mx="auto" gap="16" align="stretch">
               <VStack textAlign="center" gap="6">
                  <Heading color="fg" _dark={{ color: mkt.primary }}>
                     How it works ❧
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
                  >
                     <Text
                        color="fg"
                        _dark={{ color: "fg.muted" }}
                        fontSize="lg"
                        lineHeight="relaxed"
                     >
                        Legacy Immortal is a federated, self-sovereign digital archive. No single
                        server owns your data — you hold your own cryptographic identity, and every
                        action you take (a memorial post, a photo upload, a message) is signed with
                        your key so it can never be forged or taken from you.
                     </Text>
                  </Box>
               </VStack>

               <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 6, lg: 8 }} width="100%">
                  <Card padding="lg" variant="outlined" height="100%">
                     <VStack align="stretch" gap="4" textAlign="left">
                        <Heading
                           as="h3"
                           color="fg"
                           display="flex"
                           alignItems="center"
                           gap="3"
                           _dark={{ color: mkt.accent }}
                           fontSize="lg"
                           fontWeight="semibold"
                        >
                           <Box
                              as="span"
                              flexShrink="0"
                              display="inline-flex"
                              color="fg"
                              _dark={{ color: mkt.accent }}
                           >
                              <GiKey size={20} aria-hidden />
                           </Box>
                           Your own identity ❧
                        </Heading>
                        <Text
                           color="fg"
                           _dark={{ color: "fg.muted" }}
                           fontSize="sm"
                           lineHeight="relaxed"
                        >
                           Every user is an actor with their own cryptographic key pair — the same
                           kind of public-key infrastructure that secures the web. You control the
                           keys; the platform never holds your identity on your behalf. What you
                           publish carries your signature, so it's provably yours, forever.
                        </Text>
                     </VStack>
                  </Card>

                  <Card padding="lg" variant="outlined" height="100%">
                     <VStack align="stretch" gap="4" textAlign="left">
                        <Heading
                           as="h3"
                           color="fg"
                           display="flex"
                           alignItems="center"
                           gap="3"
                           _dark={{ color: mkt.accent }}
                           fontSize="lg"
                           fontWeight="semibold"
                        >
                           <Box
                              as="span"
                              flexShrink="0"
                              display="inline-flex"
                              color="fg"
                              _dark={{ color: mkt.accent }}
                           >
                              <GiScrollQuill size={20} aria-hidden />
                           </Box>
                           Every action signed ❧
                        </Heading>
                        <Text
                           color="fg"
                           _dark={{ color: "fg.muted" }}
                           fontSize="sm"
                           lineHeight="relaxed"
                        >
                           Every outbound action — a memorial post, a note, an upload — is
                           cryptographically signed. Recipients verify it with your public key, so
                           your words and media are tamper-evident and non-repudiable. An audit
                           trail you own, not one a platform can delete.
                        </Text>
                     </VStack>
                  </Card>

                  <Card padding="lg" variant="outlined" height="100%">
                     <VStack align="stretch" gap="4" textAlign="left">
                        <Heading
                           as="h3"
                           color="fg"
                           display="flex"
                           alignItems="center"
                           gap="3"
                           _dark={{ color: mkt.accent }}
                           fontSize="lg"
                           fontWeight="semibold"
                        >
                           <Box
                              as="span"
                              flexShrink="0"
                              display="inline-flex"
                              color="fg"
                              _dark={{ color: mkt.accent }}
                           >
                              <GiLockers size={20} aria-hidden />
                           </Box>
                           Federated & peer-replicated ❧
                        </Heading>
                        <Text
                           color="fg"
                           _dark={{ color: "fg.muted" }}
                           fontSize="sm"
                           lineHeight="relaxed"
                        >
                           Nodes speak ActivityPub (the fediverse protocol), so your memorials and
                           posts reach your followers' inboxes wherever they're hosted. Peer
                           replication copies your estate artifacts to authorized nodes — permanence
                           through redundancy, not a single point of failure.
                        </Text>
                     </VStack>
                  </Card>

                  <Card padding="lg" variant="outlined" height="100%">
                     <VStack align="stretch" gap="4" textAlign="left">
                        <Heading
                           as="h3"
                           color="fg"
                           display="flex"
                           alignItems="center"
                           gap="3"
                           _dark={{ color: mkt.accent }}
                           fontSize="lg"
                           fontWeight="semibold"
                        >
                           <Box
                              as="span"
                              flexShrink="0"
                              display="inline-flex"
                              color="fg"
                              _dark={{ color: mkt.accent }}
                           >
                              <GiLockPicking size={20} aria-hidden />
                           </Box>
                           Verified authentication ❧
                        </Heading>
                        <Text
                           color="fg"
                           _dark={{ color: "fg.muted" }}
                           fontSize="sm"
                           lineHeight="relaxed"
                        >
                           Authentication uses your actor document's public key. Signatures are
                           reconstructed and verified with RSA — valid content is stored, invalid
                           requests are rejected. Replay resistance comes from signed digest and
                           date headers. Security baked into every request, not bolted on.
                        </Text>
                     </VStack>
                  </Card>

                  <Card padding="lg" variant="outlined" height="100%">
                     <VStack align="stretch" gap="4" textAlign="left">
                        <Heading
                           as="h3"
                           color="fg"
                           display="flex"
                           alignItems="center"
                           gap="3"
                           _dark={{ color: mkt.accent }}
                           fontSize="lg"
                           fontWeight="semibold"
                        >
                           <Box
                              as="span"
                              flexShrink="0"
                              display="inline-flex"
                              color="fg"
                              _dark={{ color: mkt.accent }}
                           >
                              <GiLockedDoor size={20} aria-hidden />
                           </Box>
                           Self-host or host with us ❧
                        </Heading>
                        <Text
                           color="fg"
                           _dark={{ color: "fg.muted" }}
                           fontSize="sm"
                           lineHeight="relaxed"
                        >
                           The core protocol runs entirely on your local network if you want —
                           prove identity, sign actions, and recognize peers across devices without
                           public infrastructure. Scale to wider federation when you're ready, or
                           let us host it for you. Your choice, your terms.
                        </Text>
                     </VStack>
                  </Card>
               </SimpleGrid>
            </VStack>
         </Container>
      </Box>
   );
}
