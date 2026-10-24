import { useCallback, useState } from "react";

export interface UseInvitationReturn {
   generateKey: (email?: string) => Promise<string | null>;
   validateKey: (key: string) => Promise<boolean>;
   claimKey: (
      key: string,
      email: string,
      handle: string,
   ) => Promise<{ success: boolean; message: string }>;
   checkQuota: () => Promise<{ canGenerate: boolean; remaining: number }>;
   key: string | null;
   loading: boolean;
   error: string | null;
   quota: { canGenerate: boolean; remaining: number } | null;
}

const API_BASE = import.meta.env?.VITE_API_BASE ?? "";

async function postJson<T>(path: string, body: unknown): Promise<T> {
   const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
   });
   if (!res.ok) {
      throw new Error(await res.text());
   }
   return (await res.json()) as T;
}

export const useInvitation = (): UseInvitationReturn => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [key, setKey] = useState<string | null>(null);
   const [quota, setQuota] = useState<{ canGenerate: boolean; remaining: number } | null>(null);

   const generateKey = useCallback(async (email?: string): Promise<string | null> => {
      setLoading(true);
      setError(null);

      try {
         // Backend enforces gating (optional) and uniqueness
         const result = await postJson<{ invitationKey: string }>("/invites/generate", {
            email: email || undefined,
         });
         setKey(result.invitationKey);
         setQuota(null);
         return result.invitationKey;
      } catch (err) {
         const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
         setError(errorMessage);
         return null;
      } finally {
         setLoading(false);
      }
   }, []);

   const validateKey = useCallback(async (key: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
         const res = await fetch(`${API_BASE}/invites/validate?key=${encodeURIComponent(key)}`);
         if (!res.ok) {
            return false;
         }
         const json = (await res.json()) as { valid: boolean };
         return !!json.valid;
      } catch {
         setError("Failed to validate invitation key");
         return false;
      } finally {
         setLoading(false);
      }
   }, []);

   const claimKey = useCallback(
      async (
         key: string,
         email: string,
         handle: string,
      ): Promise<{ success: boolean; message: string }> => {
         setLoading(true);
         setError(null);

         try {
            const result = await postJson<{ success: boolean; message: string }>("/invites/claim", {
               invitationKey: key,
               email,
               handle,
            });
            return result;
         } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to claim invitation";
            setError(errorMessage);
            return { success: false, message: errorMessage };
         } finally {
            setLoading(false);
         }
      },
      [],
   );

   const checkQuota = useCallback(async (): Promise<{
      canGenerate: boolean;
      remaining: number;
   }> => {
      setLoading(true);
      setError(null);

      try {
         // Quota is enforced on the backend (if enabled). Keep UI compatible.
         const defaultQuota = { canGenerate: true, remaining: 0 };
         setQuota(defaultQuota);
         return defaultQuota;
      } catch (err) {
         const errorMessage = err instanceof Error ? err.message : "Failed to check quota";
         setError(errorMessage);
         throw new Error(errorMessage);
      } finally {
         setLoading(false);
      }
   }, []);

   return {
      generateKey,
      validateKey,
      claimKey,
      checkQuota,
      key,
      loading,
      error,
      quota,
   };
};
