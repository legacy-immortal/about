/**
 * Shared "am I already on the about home?" check for Header/Footer nav.
 * When true, section links intercept the click and smooth-scroll in place
 * (see `scrollToSection`). When false, they fall back to real navigation
 * (compat path + hash) since the target page has not mounted yet.
 * @module routes/about/-lib/useIsAboutHome
 **/
import { useRouterState } from "@tanstack/react-router";
import { isBrowserOnOfficialPromoHost } from "~/lib/shared/promoHost";

export const ABOUT_HOME = "/";
export const ABOUT_COMPAT_PATH = "/about";

export interface AboutHomeState {
   isAboutHome: boolean;
   onPromoHost: boolean;
}

export function useIsAboutHome(): AboutHomeState {
   const currentPath = useRouterState({ select: (s) => s.location.pathname });
   const onPromoHost = isBrowserOnOfficialPromoHost();
   const isAboutHome =
      currentPath === ABOUT_HOME ||
      currentPath === ABOUT_COMPAT_PATH ||
      currentPath === `${ABOUT_COMPAT_PATH}/`;
   return { isAboutHome, onPromoHost };
}

/** Builds an href for a section link: in-page hash on the home page, compat-path hash otherwise. */
export function buildSectionHref(id: string, state: AboutHomeState): string {
   if (state.isAboutHome) {
      return `#${id}`;
   }
   return `${state.onPromoHost ? "" : ABOUT_COMPAT_PATH}#${id}`;
}
