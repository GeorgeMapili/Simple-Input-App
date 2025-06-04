import { initTRPC, inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import { prisma } from "./db";
import { inputTextSchema } from "shared";

/**
 * Initialize tRPC for creating procedures and routers
 */
export const t = initTRPC.context<{ prisma?: any }>().create();

// Define input schema for pagination
const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  cursor: z.number().optional(), // ID to start from
});

/**
 * Define the router and procedures
 */
export const appRouter = t.router({
  getInputs: t.procedure
    .input(paginationSchema.optional())
    .query(async ({ input, ctx }) => {
      const limit = input?.limit ?? 10;
      const cursor = input?.cursor;

      // Use the provided context's prisma if available (for testing), otherwise use the global prisma
      const db = ctx.prisma || prisma;

      const items = await db.input.findMany({
        take: limit + 1, // get one extra item to know if there are more items
        where: cursor ? { id: { lt: cursor } } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  createInput: t.procedure
    .input(inputTextSchema)
    .mutation(async ({ input, ctx }) => {
      // Use the provided context's prisma if available (for testing), otherwise use the global prisma
      const db = ctx.prisma || prisma;

      return await db.input.create({
        data: {
          text: input.text,
        },
      });
    }),
});

/**
 * Export type helpers to be used by client
 */
export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
