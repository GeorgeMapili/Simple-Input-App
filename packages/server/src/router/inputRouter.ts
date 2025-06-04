import { z } from "zod";
import { t } from "../trpc";
import { prisma } from "../db";

/**
 * Input router with procedures for CRUD operations on inputs
 */
export const inputRouter = t.router({
  getInputs: t.procedure.query(async () => {
    return await prisma.input.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  createInput: t.procedure
    .input(
      z.object({
        text: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.input.create({
        data: {
          text: input.text,
        },
      });
    }),
});
