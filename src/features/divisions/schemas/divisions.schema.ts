import { z } from "zod";
import { codeField, requiredText } from "../../../utils/validators";
import type { DivisionForm } from "../../../types";

export const divisionSchema = z.object({
  code: codeField(),
  name: requiredText(),
}) satisfies z.ZodType<DivisionForm, DivisionForm>;
