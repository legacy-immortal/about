import {
   HoverCard,
   Popover as ChakraPopover,
   IconButton,
   Portal,
   Text,
   type IconButtonProps,
} from "@chakra-ui/react";
import * as React from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import type { FloatingPlacement } from "../floating/floating-positioning";

const HELP_CONTENT_PROPS = {
   maxW: "xs",
   px: 3,
   py: 2.5,
   fontSize: "sm",
   lineHeight: "1.5",
   color: "fg",
   bg: "bg.panel",
   borderWidth: "1px",
   borderColor: "border.muted",
   boxShadow: "lg",
} as const;

export interface ToggleTipProps extends ChakraPopover.RootProps {
   showArrow?: boolean;
   portalled?: boolean;
   portalRef?: React.RefObject<HTMLElement | null>;
   content?: React.ReactNode;
   contentProps?: ChakraPopover.ContentProps;
}

export const ToggleTip = React.forwardRef<HTMLDivElement, ToggleTipProps>(
   function ToggleTip(props, ref) {
      const {
         showArrow = true,
         children,
         portalled = true,
         content,
         contentProps,
         portalRef,
         ...rest
      } = props;

      return (
         <ChakraPopover.Root {...rest} positioning={{ ...rest.positioning, gutter: 6 }}>
            <ChakraPopover.Trigger asChild>{children}</ChakraPopover.Trigger>
            <Portal disabled={!portalled} container={portalRef}>
               <ChakraPopover.Positioner>
                  <ChakraPopover.Content
                     ref={ref}
                     {...HELP_CONTENT_PROPS}
                     {...contentProps}
                  >
                     {showArrow ? (
                        <ChakraPopover.Arrow>
                           <ChakraPopover.ArrowTip />
                        </ChakraPopover.Arrow>
                     ) : null}
                     {content}
                  </ChakraPopover.Content>
               </ChakraPopover.Positioner>
            </Portal>
         </ChakraPopover.Root>
      );
   },
);

export interface InfoTipProps extends Partial<ToggleTipProps> {
   buttonProps?: IconButtonProps | undefined;
   /** Hover (default) or click to open. */
   interaction?: "hover" | "click";
   openDelay?: number;
   closeDelay?: number;
   placement?: FloatingPlacement;
}

function renderHelpContent(children: React.ReactNode): React.ReactNode {
   if (typeof children === "string") {
      return <Text lineHeight="inherit">{children}</Text>;
   }
   return children;
}

export const InfoTip = React.forwardRef<HTMLDivElement, InfoTipProps>(function InfoTip(props, ref) {
   const {
      children,
      buttonProps,
      interaction = "hover",
      openDelay = 250,
      closeDelay = 150,
      placement = "top",
      showArrow = true,
      portalled = true,
      portalRef,
      contentProps,
      ...rest
   } = props;

   const helpContent = renderHelpContent(children);
   const mergedContentProps = { ...HELP_CONTENT_PROPS, ...contentProps };

   const triggerButton = (
      <IconButton
         variant="ghost"
         aria-label="More information"
         size="2xs"
         colorPalette="gray"
         flexShrink={0}
         {...buttonProps}
      >
         <HiOutlineInformationCircle />
      </IconButton>
   );

   if (interaction === "click") {
      return (
         <ToggleTip
            content={helpContent}
            showArrow={showArrow}
            portalled={portalled}
            portalRef={portalRef}
            contentProps={mergedContentProps}
            positioning={{ placement, gutter: 6 }}
            {...rest}
            ref={ref}
         >
            {triggerButton}
         </ToggleTip>
      );
   }

   return (
      <HoverCard.Root
         openDelay={openDelay}
         closeDelay={closeDelay}
         positioning={{ placement, gutter: 8 }}
         lazyMount
         unmountOnExit
         {...rest}
      >
         <HoverCard.Trigger asChild>{triggerButton}</HoverCard.Trigger>
         <Portal disabled={!portalled} container={portalRef}>
            <HoverCard.Positioner>
               <HoverCard.Content ref={ref} {...mergedContentProps}>
                  {showArrow ? <HoverCard.Arrow /> : null}
                  {helpContent}
               </HoverCard.Content>
            </HoverCard.Positioner>
         </Portal>
      </HoverCard.Root>
   );
});
