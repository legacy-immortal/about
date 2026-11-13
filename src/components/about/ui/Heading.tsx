"use client";

import type { HeadingProps as ChakraHeadingProps } from "@chakra-ui/react";
import { Heading as ChakraHeading } from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface AboutHeadingProps extends Omit<ChakraHeadingProps, "as"> {
   children: ReactNode;
   className?: string;
   as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
   /** Serif is the default; set false to inherit the body face. */
   serif?: boolean;
}

/**
 * Every heading on the about site is set in Crimson Text — the serif carries
 * the "estate ledger" voice. Sizes come from the caller so the h1 → h2 → h3
 * hierarchy stays explicit.
 */
export function AboutHeading({
   children,
   className,
   as = "h2",
   serif = true,
   ...props
}: AboutHeadingProps) {
   return (
      <ChakraHeading
         as={as}
         className={className ? `about-heading ${className}` : "about-heading"}
         fontFamily={serif ? "heading" : "body"}
         fontWeight="semibold"
         {...props}
      >
         {children}
      </ChakraHeading>
   );
}

export default AboutHeading;
