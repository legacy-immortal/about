import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";

export function ErrorView({ error }: { error?: Error }) {
   const router = useRouter();

   return (
      <Box
         minH="100vh"
         display="flex"
         alignItems="center"
         justifyContent="center"
         bg="bg"
         color="fg"
         p="8"
      >
         <VStack gap="6" textAlign="center" maxW="md">
            <Heading as="h1" size="2xl" color="fg">
               Something went wrong
            </Heading>
            <Text color="fg.muted" fontSize="lg">
               {error?.message || "An unexpected error occurred."}
            </Text>
            <Button
               variant="cta"
               onClick={() => router.invalidate()}
            >
               Try Again
            </Button>
            <Button
               variant="ghost"
               onClick={() => (window.location.href = "/")}
            >
               Go Home
            </Button>
         </VStack>
      </Box>
   );
}