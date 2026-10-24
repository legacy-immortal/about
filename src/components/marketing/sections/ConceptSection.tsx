"use client";

import { mkt } from "~/components/marketing/lib/colors";

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
                     The Archive ❧
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
                        Legacy Immortal is designed as a federated, self-sovereign digital archive.
                        No single server owns your data. This document outlines the proposed
                        federated architecture: identity, signed actions, and cross-node
                        recognition.
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
                           Digital Sovereignty ❧
                        </Heading>
                        <Text
                           color="fg"
                           _dark={{ color: "fg.muted" }}
                           fontSize="sm"
                           lineHeight="relaxed"
                        >
                           Each node in the network is an ActivityPub actor with its own
                           cryptographic identity. An actor document (JSON-LD) exposes a stable ID,
                           inbox and outbox URLs, and a public key (RSA). You control your key pair;
                           the system never holds identity on your behalf. Identity proofs document
                           that a given actor controls a self-sovereign identity.
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
                           Self-Signed Actions ❧
                        </Heading>
                        <Text
                           color="fg"
                           _dark={{ color: "fg.muted" }}
                           fontSize="sm"
                           lineHeight="relaxed"
                        >
                           All outbound activities (e.g. Create, Note) are signed using HTTP
                           Signatures. The signature covers the request target, host, date, and
                           digest of the body. Receivers can verify authenticity and integrity with
                           the actor's public key. Signed action proofs document that actions are
                           non-repudiable and tamper-evident.
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
                           Federation, ingest & peer replication ❧
                        </Heading>
                        <Text
                           color="fg"
                           _dark={{ color: "fg.muted" }}
                           fontSize="sm"
                           lineHeight="relaxed"
                        >
                           Nodes register remote actors for ActivityPub delivery on origins such as
                           legacyimmortal.com or your self-host. When you publish, signed activities
                           reach follower inboxes. Receiving nodes verify HTTP Signatures and ingest
                           content locally. That is the fediverse (social ledger)—not permanence.
                           Peer replication (p2pMirror) copies estate artifacts to authorized nodes;
                           that is the only correct use of “mirror” here.
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
                           Authentication & Verification ❧
                        </Heading>
                        <Text
                           color="fg"
                           _dark={{ color: "fg.muted" }}
                           fontSize="sm"
                           lineHeight="relaxed"
                        >
                           Verification uses the actor document's public key: parse the Signature
                           header, reconstruct the canonical signature string, and verify with RSA.
                           On success, content is stored and mirrored; on failure, the request is
                           rejected. Replay resistance is provided by digest and date in the signed
                           headers.
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
                           Self-Hosted or Hosted by Us ❧
                        </Heading>
                        <Text
                           color="fg"
                           _dark={{ color: "fg.muted" }}
                           fontSize="sm"
                           lineHeight="relaxed"
                        >
                           The core handshake can run entirely on a local network (localhost or
                           LAN). Two nodes—e.g. a workstation and a spare device—can prove identity,
                           signed actions, and cross-node recognition without depending on public
                           infrastructure. The same protocol scales to wider federation when
                           desired.
                        </Text>
                     </VStack>
                  </Card>
               </SimpleGrid>
            </VStack>
         </Container>
      </Box>
   );
}
