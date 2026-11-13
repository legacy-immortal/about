"use client";

import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from "@chakra-ui/react";
import { forwardRef, type ElementType, type ReactNode } from "react";
import { stripFleuron } from "../lib/fleuron";

export interface ButtonProps extends Omit<
   ChakraButtonProps,
   "variant" | "size" | "children" | "as" | "href" | "onClick"
> {
   variant?: "primary" | "secondary" | "outline" | "ghost" | "cta";
   size?: "sm" | "md" | "lg";
   href?: string;
   disabled?: boolean;
   loading?: boolean;
   children?: ReactNode;
   className?: string;
   onClick?: () => void;
   /** Override rendered element (e.g. "div" for editable button that does not navigate) */
   as?: ElementType;
}

/** Button labels carry no ornament — the fleuron belongs to titles. */
function label(children: ReactNode): ReactNode {
   return typeof children === "string" ? stripFleuron(children) : children;
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
      const commonProps = {
         ref,
         variant,
         size,
         disabled: disabled || loading,
         loading,
         className: className ? `${className} surreal-button` : "surreal-button",
         "data-variant": variant,
         "data-size": size,
         ...props,
      };

      if (as) {
         return (
            <ChakraButton as={as} {...commonProps} {...(props as never)}>
               {label(children)}
            </ChakraButton>
         );
      }

      if (href) {
         return (
            <ChakraButton as="a" href={href} {...commonProps} {...(props as never)}>
               {label(children)}
            </ChakraButton>
         );
      }

      return (
         <ChakraButton {...commonProps} onClick={onClick} {...(props as never)}>
            {label(children)}
         </ChakraButton>
      );
   },
);

Button.displayName = "Button";
