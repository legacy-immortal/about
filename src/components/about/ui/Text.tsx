"use client";

import type { TextProps as ChakraTextProps } from "@chakra-ui/react";
import { Text as ChakraText } from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface AboutTextProps extends Omit<ChakraTextProps, "as"> {
   children: ReactNode;
   className?: string;
   as?: "p" | "span" | "div";
   /** Use serif (Crimson Text) for display passages and pull quotes. */
   serif?: boolean;
   /** Use mono (IBM Plex Mono) for literal values — keys, hashes, identifiers. */
   mono?: boolean;
}

export function AboutText({
   children,
   className,
   as = "p",
   serif = false,
   mono = false,
   ...props
}: AboutTextProps) {
   return (
      <ChakraText
         as={as}
         className={className ? `about-text ${className}` : "about-text"}
         fontFamily={serif ? "heading" : mono ? "mono" : "body"}
         {...props}
      >
         {children}
      </ChakraText>
   );
}

export default AboutText;
