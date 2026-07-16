import { z } from "zod";

const semverPattern = /^\d+\.\d+\.\d+$/;

export const launchLocaleSchema = z.enum(["en", "es", "pt", "zh", "ar", "tr"]);

export const appConfigSchema = z
  .object({
    version: z.string().regex(semverPattern, "version must follow semantic versioning"),
    defaultLocale: launchLocaleSchema,
    supportedLocales: z.array(launchLocaleSchema).min(1),
  })
  .superRefine((config, ctx) => {
    if (!config.supportedLocales.includes(config.defaultLocale)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "defaultLocale must exist in supportedLocales",
        path: ["defaultLocale"],
      });
    }
  });

export type AppConfigFile = z.infer<typeof appConfigSchema>;
