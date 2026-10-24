import type { IconButtonProps, SpanProps } from "@chakra-ui/react";
import { Flex, HStack, IconButton, RadioCard, Skeleton, Span, Text } from "@chakra-ui/react";
import * as React from "react";
import { LuMonitor, LuMoon, LuSun } from "react-icons/lu";

export type PreferredColorMode = "light" | "dark" | "system";
export const COLOR_MODE_STORAGE_KEY = "theme-ui-color-mode";

const ColorModeContext = React.createContext<{
   colorMode: "light" | "dark";
   preferredColorMode: PreferredColorMode;
   toggleColorMode: () => void;
   setColorMode: (mode: "light" | "dark") => void;
   setPreferredColorMode: (mode: PreferredColorMode) => void;
}>({
   colorMode: "light",
   preferredColorMode: "system",
   toggleColorMode: () => {},
   setColorMode: () => {},
   setPreferredColorMode: () => {},
});

function resolveSystemToColorMode(): "light" | "dark" {
   if (typeof window === "undefined") {
      return "light";
   }
   return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export interface ColorModeProviderProps {
   children: React.ReactNode;
   storageKey?: string;
   defaultTheme?: PreferredColorMode;
}

/** SSR-safe: initial state matches server (defaultTheme + light). After mount we read localStorage and system preference so hydration matches. */
export function ColorModeProvider({
   children,
   storageKey = "theme-ui-color-mode",
   defaultTheme = "system",
}: ColorModeProviderProps) {
   const [preferredColorMode, setPreferredColorModeState] =
      React.useState<PreferredColorMode>(defaultTheme);

   const [systemResolved, setSystemResolved] = React.useState<"light" | "dark">("light");

   const colorMode: "light" | "dark" =
      preferredColorMode === "system" ? systemResolved : preferredColorMode;

   React.useEffect(() => {
      if (typeof window === "undefined") {
         return;
      }
      setSystemResolved(resolveSystemToColorMode());
      const saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark" || saved === "system") {
         setPreferredColorModeState(saved);
      }
   }, [storageKey]);

   React.useEffect(() => {
      if (typeof window === "undefined") {
         return;
      }
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => setSystemResolved(mq.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
   }, []);

   React.useEffect(() => {
      if (typeof window !== "undefined") {
         const root = window.document.documentElement;
         root.classList.remove("light", "dark");
         root.classList.add(colorMode);
         localStorage.setItem(storageKey, preferredColorMode);
      }
   }, [colorMode, preferredColorMode, storageKey]);

   const toggleColorMode = React.useCallback(() => {
      setPreferredColorModeState((prev) => {
         const next =
            prev === "system"
               ? systemResolved === "light"
                  ? "dark"
                  : "light"
               : prev === "light"
                 ? "dark"
                 : "light";
         return next;
      });
   }, [systemResolved]);

   const setColorModeValue = React.useCallback((value: "light" | "dark") => {
      setPreferredColorModeState(value);
   }, []);

   const setPreferredColorMode = React.useCallback((value: PreferredColorMode) => {
      setPreferredColorModeState(value);
   }, []);

   const contextValue = React.useMemo(
      () => ({
         colorMode,
         preferredColorMode,
         toggleColorMode,
         setColorMode: setColorModeValue,
         setPreferredColorMode,
      }),
      [colorMode, preferredColorMode, toggleColorMode, setColorModeValue, setPreferredColorMode],
   );

   return <ColorModeContext.Provider value={contextValue}>{children}</ColorModeContext.Provider>;
}

export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
   colorMode: ColorMode;
   preferredColorMode: PreferredColorMode;
   setColorMode: (colorMode: ColorMode) => void;
   setPreferredColorMode: (mode: PreferredColorMode) => void;
   toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
   const context = React.useContext(ColorModeContext);
   if (!context) {
      throw new Error("useColorMode must be used within a ColorModeProvider");
   }
   return context;
}

export function useColorModeValue<T>(lightValue: T, darkValue: T): T {
   const { colorMode } = useColorMode();
   return colorMode === "dark" ? darkValue : lightValue;
}

function ColorModeIcon() {
   const { colorMode } = useColorMode();
   return colorMode === "dark" ? <LuMoon size={18} /> : <LuSun size={18} />;
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

const COLOR_MODE_OPTIONS: Array<{
   value: PreferredColorMode;
   icon: React.ReactNode;
   label: string;
}> = [
   { value: "system", icon: <LuMonitor size={18} />, label: "System" },
   { value: "light", icon: <LuSun size={18} />, label: "Light" },
   { value: "dark", icon: <LuMoon size={18} />, label: "Dark" },
];

/** Selectable radio cards for light / system / dark mode. Use in theme or appearance settings. */
export function ColorModeRadioCards() {
   const { preferredColorMode, setPreferredColorMode } = useColorMode();
   return (
      <RadioCard.Root
         size="sm"
         value={preferredColorMode}
         onValueChange={(e) => setPreferredColorMode((e.value as PreferredColorMode) ?? "system")}
         width="full"
      >
         <Flex gap="4">
            {COLOR_MODE_OPTIONS.map((item) => (
               <RadioCard.Item key={item.value} value={item.value} overflow="hidden" flex="1">
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl p="2.5" alignItems="center">
                     <RadioCard.ItemIndicator />
                     <HStack gap="2">
                        {item.icon}
                        <Text>{item.label}</Text>
                     </HStack>
                  </RadioCard.ItemControl>
               </RadioCard.Item>
            ))}
         </Flex>
      </RadioCard.Root>
   );
}

export const ColorModeButton = React.forwardRef<HTMLButtonElement, ColorModeButtonProps>(
   function ColorModeButton(props, ref) {
      const { toggleColorMode } = useColorMode();
      const [mounted, setMounted] = React.useState(false);
      React.useEffect(() => setMounted(true), []);
      if (!mounted) {
         return <Skeleton boxSize="8" borderRadius="md" />;
      }
      return (
         <IconButton
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle color mode"
            size="sm"
            ref={ref}
            {...props}
         >
            <ColorModeIcon />
         </IconButton>
      );
   },
);

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
   function LightMode(props, ref) {
      return (
         <Span
            color="fg"
            display="contents"
            className="chakra-theme light"
            colorPalette="gray"
            colorScheme="light"
            ref={ref}
            {...props}
         />
      );
   },
);

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(function DarkMode(props, ref) {
   return (
      <Span
         color="fg"
         display="contents"
         className="chakra-theme dark"
         colorPalette="gray"
         colorScheme="dark"
         ref={ref}
         {...props}
      />
   );
});
