"use client";

import type { HeadingProps as ChakraHeadingProps } from "@chakra-ui/react";
import { Heading as ChakraHeading } from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface AboutHeadingProps extends Omit<ChakraHeadingProps, "as"> {
   children: ReactNode;
   className?: string;
   as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
   /** Always serif for headings — matches the logo typeface */
   serif?: boolean;
}

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
         {...props}
      >
         {children}
      </ChakraHeading>
   );
}

export default AboutHeading;
