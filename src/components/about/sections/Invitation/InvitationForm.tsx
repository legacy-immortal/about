"use client";

import { Alert, Box, Field, Input, Text, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useInvitation } from "~/components/about/lib/hooks/useInvitation";
import { Button } from "../../ui/Button";

const COPY = {
   emailLabel: "Email address",
   yourKeyLabel: "Your invite keys",
   keyHint: "Five keys per email. Keep them for yourself or pass them to family and friends.",
   buttonText: "Get invite keys",
} as const;

const generateSchema = z.object({
   email: z.string().min(1, "Enter your email address").email("Enter a valid email address"),
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
      <Box as="form" onSubmit={handleSubmit(handleFormSubmit)} className="about-field">
         <VStack gap="6" align="stretch" maxW="28rem">
            <Field.Root invalid={!!errors.email}>
               <Field.Label htmlFor="invite-email" color="fg.muted">
                  {COPY.emailLabel}
               </Field.Label>
               <Input
                  {...register("email")}
                  id="invite-email"
                  type="email"
                  width="100%"
                  variant="flushed"
                  borderRadius="0"
                  placeholder="you@example.com"
               />
               {errors.email ? (
                  <Field.ErrorText mt="1" fontSize="sm" color="red.600">
                     {errors.email.message}
                  </Field.ErrorText>
               ) : null}
            </Field.Root>

            {generatedKey ? (
               <Box>
                  <Text color="fg.muted" mb="2" fontSize="sm">
                     {COPY.yourKeyLabel}
                  </Text>
                  <Box className="about-key">{generatedKey}</Box>
                  <Text fontSize="sm" color="fg.subtle" mt="2">
                     {COPY.keyHint}
                  </Text>
               </Box>
            ) : null}

            {quota ? (
               <Text fontSize="sm" color="fg.muted">
                  {quota.canGenerate
                     ? `${quota.remaining} invite keys left today.`
                     : "You have used every key for today. Try again tomorrow."}
               </Text>
            ) : null}

            {error ? (
               <Alert.Root status="error" variant="subtle" width="100%">
                  <Alert.Indicator />
                  <Alert.Title fontSize="sm">{error}</Alert.Title>
               </Alert.Root>
            ) : null}

            <Button
               type="submit"
               width="100%"
               disabled={loading || (quota !== null && !quota.canGenerate)}
               variant="primary"
               size="md"
               _disabled={{ opacity: 0.45, cursor: "not-allowed" }}
               loading={loading}
               loadingText="Working…"
            >
               {COPY.buttonText}
            </Button>
         </VStack>
      </Box>
   );
}
