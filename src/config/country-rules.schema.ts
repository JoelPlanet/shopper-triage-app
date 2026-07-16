import { z } from "zod";

const semverPattern = /^\d+\.\d+\.\d+$/;
const isoCountryCodePattern = /^[A-Z]{2}$/;

export const countryValidationRuleSchema = z.object({
  countryCode: z.string().regex(isoCountryCodePattern, "countryCode must be ISO alpha-2"),
  supportsDigitalValidation: z.boolean(),
  isActive: z.boolean(),
  updatedAt: z.string().datetime({ offset: true }).optional(),
});

export const rulesConfigSchema = z
  .object({
    version: z.string().regex(semverPattern, "version must follow semantic versioning"),
    defaultOutcomeCode: z.literal("SEND_FORM"),
    precedence: z.tuple([
      z.literal("NO_DIGITAL_VALIDATION"),
      z.literal("DIFFERENT_COUNTRY"),
      z.literal("SAME_COUNTRY_WITH_DIGITAL"),
    ]),
    countries: z.array(countryValidationRuleSchema),
  })
  .superRefine((config, ctx) => {
    const seen = new Set<string>();

    for (let i = 0; i < config.countries.length; i += 1) {
      const countryCode = config.countries[i].countryCode;

      if (seen.has(countryCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate countryCode: ${countryCode}`,
          path: ["countries", i, "countryCode"],
        });
      }

      seen.add(countryCode);
    }
  });

export type CountryValidationRuleConfig = z.infer<typeof countryValidationRuleSchema>;
export type RulesConfigFile = z.infer<typeof rulesConfigSchema>;
