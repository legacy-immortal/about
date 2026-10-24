import { Alert, Box, Field, Input, Text, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useInvitation } from "~/components/marketing/lib/hooks/useInvitation";
import { Button } from "../../ui/Button";

const COPY = {
   emailLabel: "Email Address ❧",
   yourKeyLabel: "Your key ❧",
   keyHint: "Save it. Use one for yourself or give keys to friends and family. ❧",
   buttonText: "Join the waitlist ❧",
} as const;

const generateSchema = z.object({
   email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

type GenerateFormData = z.infer<typeof generateSchema>;

export default function InvitationForm() {
   const { generateKey, key: generatedKey, loading, error, quota } = useInvitation();
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<GenerateFormData>({
      resolver: zodResolver(generateSchema),
   });

   const handleFormSubmit = async (data: GenerateFormData) => {
      const result = await generateKey(data.email);
      if (result) {
         reset();
      }
   };

   return (
      <Box maxW="md" mx="auto" textAlign="center">
         <Box as="form" onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack gap="6" align="stretch">
               <Field.Root invalid={!!errors.email}>
                  <Field.Label
                     color="fg"
                     mb="2"
                     _dark={{ color: "fg.muted" }}
                     fontSize="sm"
                     fontWeight="medium"
                  >
                     {COPY.emailLabel}
                  </Field.Label>
                  <Input
                     {...register("email")}
                     type="email"
                     width="100%"
                     px="4"
                     py="3"
                     bg="transparent"
                     border="none"
                     borderBottom="1px solid"
                     borderColor="currentColor"
                     borderRadius="0"
                     opacity={0.8}
                     color="fg"
                     placeholder="your@email.com"
                     _focus={{ opacity: 1, outline: "none" }}
                     _placeholder={{ color: "fg.subtle", opacity: 0.7 }}
                     _dark={{
                        color: "primary.500",
                        _placeholder: { color: "fg.muted", opacity: 0.6 },
                     }}
                     transition="all 0.3s ease"
                     variant="flushed"
                  />
                  {errors.email ? (
                     <Field.ErrorText
                        mt="1"
                        fontSize="sm"
                        color="red.500"
                        _dark={{ color: "red.400" }}
                     >
                        {errors.email.message}
                     </Field.ErrorText>
                  ) : null}
               </Field.Root>

               {generatedKey ? (
                  <Box
                     p="4"
                     borderBottom="1px solid"
                     borderColor="currentColor"
                     opacity={0.3}
                     width="100%"
                  >
                     <Text color="fg" mb="2" _dark={{ color: "fg.muted" }} fontSize="sm">
                        {COPY.yourKeyLabel}
                     </Text>
                     <Text
                        fontSize="lg"
                        fontFamily="mono"
                        fontWeight="bold"
                        color="fg"
                        userSelect="all"
                        _dark={{ color: "primary.500" }}
                     >
                        {generatedKey}
                     </Text>
                     <Text fontSize="xs" color="fg" mt="2" _dark={{ color: "fg.muted" }}>
                        {COPY.keyHint}
                     </Text>
                  </Box>
               ) : null}

               {quota ? (
                  <Text fontSize="sm" color="fg" _dark={{ color: "fg.muted" }} width="100%">
                     {quota.canGenerate ? (
                        <Text _dark={{ color: "fg.muted" }}>{quota.remaining} keys left today</Text>
                     ) : (
                        <Text color="red.500" _dark={{ color: "red.400" }}>
                           Daily quota reached. Try again tomorrow.
                        </Text>
                     )}
                  </Text>
               ) : null}

               {error ? (
                  <Alert.Root status="error" variant="subtle" width="100%">
                     <Alert.Indicator />
                     <Alert.Title fontSize="sm" color="red.400">
                        {error}
                     </Alert.Title>
                  </Alert.Root>
               ) : null}

               <Button
                  type="submit"
                  width="100%"
                  disabled={loading || (quota !== null && !quota.canGenerate)}
                  variant="outline"
                  size="md"
                  letterSpacing="0.02em"
                  _disabled={{ opacity: 0.3, cursor: "not-allowed" }}
                  py="3"
                  px="6"
                  borderWidth="2px"
                  transition="all 0.3s ease"
                  loading={loading}
                  loadingText="Processing..."
                  fontWeight="semibold"
               >
                  {COPY.buttonText}
               </Button>
            </VStack>
         </Box>
      </Box>
   );
}
