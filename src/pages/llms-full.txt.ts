import { llmsFullRoute } from "@cloudflare/nimbus-docs/agent-endpoints";
import { withDisclaimer } from "../lib/llms-disclaimer";

export const prerender = true;
export const GET = withDisclaimer(llmsFullRoute().GET);
