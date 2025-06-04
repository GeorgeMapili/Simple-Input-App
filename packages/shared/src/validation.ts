import { z } from "zod";
import { INPUT_CONSTRAINTS } from "./constants";

/**
 * Validation schema for input text
 */
export const inputTextSchema = z.object({
  text: z
    .string()
    .min(INPUT_CONSTRAINTS.MIN_LENGTH, "Input cannot be empty")
    .max(
      INPUT_CONSTRAINTS.MAX_LENGTH,
      "Input must be less than 255 characters"
    ),
});

/**
 * Type inference from the schema
 */
export type InputTextSchema = z.infer<typeof inputTextSchema>;
