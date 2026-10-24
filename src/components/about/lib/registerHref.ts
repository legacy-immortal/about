/**
 * Apex sign-up destination for about CTAs — the alpha-invite generate/claim flow
 * was removed (see `docs/documentation/about-integration.md`); CTAs go straight
 * to registration.
 * @module routes/about/-lib/registerHref
 **/
import { DASHBOARD_BASEPATH } from "~/constants";
import { getApexAppHref } from "~/lib/shared/promoHost";

export function getRegisterHref(): string {
   return getApexAppHref(`${DASHBOARD_BASEPATH}?register=1`);
}
