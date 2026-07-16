import { rulesConfigSchema, type RulesConfigFile } from "./country-rules.schema";

const RULES_CONFIG_PATH = "/config/country-rules.v1.json";

export interface RulesConfigLoadResult {
  config: RulesConfigFile;
  diagnostics: string[];
}

export const FALLBACK_RULES_CONFIG: RulesConfigFile = {
  version: "1.0.0",
  defaultOutcomeCode: "SEND_FORM",
  precedence: ["NO_DIGITAL_VALIDATION", "DIFFERENT_COUNTRY", "SAME_COUNTRY_WITH_DIGITAL"],
  countries: [],
};

function asErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export async function loadRulesConfig(
  configPath: string = RULES_CONFIG_PATH,
): Promise<RulesConfigLoadResult> {
  const diagnostics: string[] = [];

  try {
    const response = await fetch(configPath, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const message = `Rules config request failed with status ${response.status}`;
      diagnostics.push(message);
      console.warn(message);

      return {
        config: FALLBACK_RULES_CONFIG,
        diagnostics,
      };
    }

    const raw = (await response.json()) as unknown;
    const parsed = rulesConfigSchema.safeParse(raw);

    if (!parsed.success) {
      const message = `Rules config schema validation failed: ${parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ")}`;

      diagnostics.push(message);
      console.warn(message);

      return {
        config: FALLBACK_RULES_CONFIG,
        diagnostics,
      };
    }

    return {
      config: parsed.data,
      diagnostics,
    };
  } catch (error) {
    const message = `Rules config load failed: ${asErrorMessage(error)}`;
    diagnostics.push(message);
    console.warn(message);

    return {
      config: FALLBACK_RULES_CONFIG,
      diagnostics,
    };
  }
}
