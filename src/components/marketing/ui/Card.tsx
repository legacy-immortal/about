"use client";

import { Card as ChakraCard } from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface ChakraCardProps extends Omit<
   ComponentPropsWithoutRef<typeof ChakraCard.Root>,
   "padding" | "p" | "variant"
> {
   padding?: "sm" | "md" | "lg" | "none";
   children: ReactNode;
   className?: string;
   variant?: "default" | "outlined";
}

const paddingMap = {
   none: 0,
   sm: 4,
   md: 6,
   lg: 8,
};

const variantStyles = {
   default: {
      boxShadow: "sm",
      border: "1px solid",
      borderColor: "border",
      _dark: { bg: "bg.800", borderColor: "border.dark", boxShadow: "md" },
   },
   outlined: {
      boxShadow: "none",
      border: "2px solid",
      borderColor: "border",
      _dark: { bg: "bg.800", borderColor: "primary.500" },
   },
};

export function Card({
   padding = "md",
   children,
   className,
   variant = "default",
   ...props
}: ChakraCardProps) {
   return (
      <ChakraCard.Root
         className={className}
         padding={0}
         p={0}
         {...variantStyles[variant]}
         {...props}
      >
         <ChakraCard.Body p={paddingMap[padding]}>{children}</ChakraCard.Body>
      </ChakraCard.Root>
   );
}

const CardBody = ChakraCard.Body;
const CardFooter = ChakraCard.Footer;
const CardHeader = ChakraCard.Header;

export { CardBody, CardFooter, CardHeader };
