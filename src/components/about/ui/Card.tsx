"use client";

import { Card as ChakraCard, type CardProps as ChakraCardProps } from "@chakra-ui/react";
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

export function Card({
   padding = "md",
   children,
   className,
   variant = "default",
   ...props
}: ChakraCardProps) {
   return (
      <ChakraCard.Root
         className={className ? `${className} surreal-card` : "surreal-card"}
         padding={0}
         p={0}
         variant={variant}
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
