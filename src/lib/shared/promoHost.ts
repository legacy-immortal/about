export function getApexAppHref(path: string = "/"): string {
   return `https://legacyimmortal.com${path}`;
}

export function isBrowserOnOfficialPromoHost(): boolean {
   return false;
}

export function isOfficialPromoHandle(handle: string): boolean {
   return handle.toLowerCase() === "official";
}

export function isOfficialPromoHostname(hostname: string): boolean {
   return hostname.startsWith("official.");
}

export function getOfficialPromoOrigin(loc: { protocol: string; hostname: string; port: string }): string {
   return `${loc.protocol}//official.${loc.hostname}${loc.port ? ":" + loc.port : ""}`;
}

export function getApexAppOrigin(loc: { protocol: string; hostname: string; port: string }): string {
   const host = loc.hostname.replace(/^official\./, "");
   return `${loc.protocol}//${host}${loc.port ? ":" + loc.port : ""}`;
}

export function buildOfficialPromoUrlFromConfig(config: { baseUrl: string; subdomainBaseDomain: string | null }, path: string): string | null {
   if (!config.subdomainBaseDomain) return null;
   return `https://official.${config.subdomainBaseDomain}${path}`;
}

export function isApexPublicSpaPath(path: string): boolean {
   return ["/marketing", "/docs", "/for-builders", "/status"].includes(path);
}