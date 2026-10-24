/**
 * Shared "am I already on the marketing home?" check for Header/Footer nav.
 * When true, section links intercept the click and smooth-scroll in place
 * (see `scrollToSection`). When false, they fall back to real navigation
 * (compat path + hash) since the target page has not mounted yet.
 * @module routes/marketing/-lib/useIsMarketingHome
 **/
import { useRouterState } from "@tanstack/react-router";
import { isBrowserOnOfficialPromoHost } from "~/lib/shared/promoHost";

export const MARKETING_HOME = "/";
export const MARKETING_COMPAT_PATH = "/marketing";

export interface MarketingHomeState {
   isMarketingHome: boolean;
   onPromoHost: boolean;
}

export function useIsMarketingHome(): MarketingHomeState {
   const currentPath = useRouterState({ select: (s) => s.location.pathname });
   const onPromoHost = isBrowserOnOfficialPromoHost();
   const isMarketingHome =
      currentPath === MARKETING_HOME ||
      currentPath === MARKETING_COMPAT_PATH ||
      currentPath === `${MARKETING_COMPAT_PATH}/`;
   return { isMarketingHome, onPromoHost };
}

/** Builds an href for a section link: in-page hash on the home page, compat-path hash otherwise. */
export function buildSectionHref(id: string, state: MarketingHomeState): string {
   if (state.isMarketingHome) {
      return `#${id}`;
   }
   return `${state.onPromoHost ? "" : MARKETING_COMPAT_PATH}#${id}`;
}
