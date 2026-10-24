"use client";

import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from "@chakra-ui/react";
import { forwardRef, type ElementType } from "react";

export interface ButtonProps extends Omit<
   ChakraButtonProps,
   "variant" | "size" | "children" | "as" | "href" | "onClick"
> {
   variant?: "primary" | "secondary" | "outline" | "ghost" | "cta";
   size?: "sm" | "md" | "lg";
   href?: string;
   disabled?: boolean;
   loading?: boolean;
   children?: ChakraButtonProps["children"];
   className?: string;
   onClick?: () => void;
   /** Override rendered element (e.g. "div" for editable button that does not navigate) */
   as?: ElementType;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
   (
      {
         variant = "primary",
         size = "md",
         href,
         disabled = false,
         loading = false,
         children,
         className,
         onClick,
         as,
         ...props
      },
      ref,
   ) => {
      const chakraVariant: "solid" | "outline" | "ghost" | "subtle" =
         variant === "primary"
            ? "solid"
            : variant === "outline" || variant === "cta"
              ? "outline"
              : variant === "ghost"
                ? "ghost"
                : "subtle";
      const colorPalette = variant === "primary" ? "primary" : undefined;

      // Base styles for legibility: theme-aligned backgrounds and text
      const baseStyles = {
         fontFamily: "mono" as const,
         fontWeight: "semibold" as const,
         lineHeight: "1" as const,
         display: "inline-flex" as const,
         alignItems: "center" as const,
         justifyContent: "center" as const,
         transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
         ...(variant === "primary" && {
            bg: "black",
            color: "bg",
            _dark: { bg: "primary.accent", color: "bg" },
         }),
         ...(variant === "outline" && {
            bg: "transparent",
            color: "black",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "black",
            _dark: { color: "fg", borderColor: "primary.accent" },
         }),
         ...(variant === "cta" && {
            bg: "transparent",
            color: "fg",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "fg",
            _dark: { color: "fg", borderColor: "fg" },
         }),
         ...(variant === "ghost" && {
            bg: "transparent",
            color: "black",
            _dark: { color: "fg" },
         }),
         ...(variant === "secondary" && {
            bg: "black",
            color: "bg",
            _dark: { bg: "bg", color: "fg" },
         }),
      };

      // Hover: theme-aligned feedback without layout shifts
      const hoverStyles = {
         ...(variant === "primary" && {
            bg: "black",
            color: "bg",
            _dark: { bg: "primary.500", color: "bg" },
         }),
         ...(variant === "outline" && {
            bg: "black",
            color: "bg",
            borderColor: "black",
            _dark: { bg: "bg", color: "fg", borderColor: "primary.accent" },
         }),
         ...(variant === "cta" && {
            bg: "fg",
            color: "bg",
            borderColor: "fg",
            _dark: { bg: "primary.accent", color: "bg", borderColor: "primary.accent" },
         }),
         ...(variant === "ghost" && {
            bg: "black",
            color: "bg",
            _dark: { bg: "bg", color: "fg" },
         }),
         ...(variant === "secondary" && {
            bg: "black",
            color: "bg",
            _dark: { bg: "fg.subtle", color: "fg" },
         }),
      };

      const commonProps = {
         ref,
         variant: chakraVariant,
         size,
         colorPalette,
         disabled: disabled || loading,
         loading,
         className,
         "data-variant": variant,
         ...baseStyles,
         _hover: { ...hoverStyles },
      };

      if (as) {
         return (
            <ChakraButton
               as={as}
               {...commonProps}
               _hover={{ ...hoverStyles, textDecoration: "none" }}
               {...(props as any)}
            >
               {children}
            </ChakraButton>
         );
      }

      if (href) {
         return (
            <ChakraButton
               as="a"
               href={href}
               {...commonProps}
               _hover={{ ...hoverStyles, textDecoration: "none" }}
               {...(props as any)}
            >
               {children}
            </ChakraButton>
         );
      }

      return (
         <ChakraButton {...commonProps} onClick={onClick} {...props}>
            {children}
         </ChakraButton>
      );
   },
);

Button.displayName = "Button";
