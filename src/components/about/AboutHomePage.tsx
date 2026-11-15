"use client";

import { AppLayout } from "./layout/AppLayout";
import { CTASection } from "./sections/CTASection";
import { ConceptSection } from "./sections/ConceptSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { HeroSection } from "./sections/Hero/HeroSection";
import { InvitationSection } from "./sections/Invitation/InvitationSection";
import { PricingSection } from "./sections/PricingSection";
import { WhatWeAreNotSection } from "./sections/WhatWeAreNotSection";
import { EARLY_ACCESS_ENABLED } from "./lib/contentLoader";

export function AboutHomePage() {
   return (
      <AppLayout>
         <HeroSection />
         <FeaturesSection />
         <ConceptSection />
         <WhatWeAreNotSection />
         {EARLY_ACCESS_ENABLED ? <InvitationSection /> : null}
         <PricingSection />
         <CTASection />
      </AppLayout>
   );
}
