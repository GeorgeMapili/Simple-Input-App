import { t } from "../trpc";
import { inputRouter } from "./inputRouter";

/**
 * Main application router that combines all sub-routers
 */
export const appRouter = t.router({
  inputs: inputRouter,
});
