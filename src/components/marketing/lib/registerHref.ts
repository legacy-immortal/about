/**
 * Apex sign-up destination for marketing CTAs — the alpha-invite generate/claim flow
 * was removed (see `docs/documentation/marketing-integration.md`); CTAs go straight
 * to registration.
 * @module routes/marketing/-lib/registerHref
 **/
import { DASHBOARD_BASEPATH } from "~/constants";
import { getApexAppHref } from "~/lib/shared/promoHost";

export function getRegisterHref(): string {
   return getApexAppHref(`${DASHBOARD_BASEPATH}?register=1`);
}
