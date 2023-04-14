import payload from "payload";
import { Meta } from "../..";
import {
  UnsupportedLocaleError,
  TranslationFailedError,
  VendorSetupError,
} from "../../core/errors";
import { TranslationVendor } from "../../types";

export type ApiType = "free" | "pro";
export class DeeplVendor implements TranslationVendor {
  private apiUrl;

  static SUPPORTED_SOURCE_LOCALES = [
    "BG",
    "CS",
    "DA",
    "DE",
    "EL",
    "EN",
    "ES",
    "ET",
    "FI",
    "FR",
    "HU",
    "ID",
    "IT",
    "JA",
    "KO",
    "LT",
    "LV",
    "NB",
    "NL",
    "PL",
    "PT",
    "RO",
    "RU",
    "SK",
    "SL",
    "SV",
    "TR",
    "UK",
    "ZH",
  ];
  static SUPPORTED_TARGET_LOCALES = [
    "BG",
    "CS",
    "DA",
    "DE",
    "EL",
    "EN",
    "EN-GB",
    "EN-US",
    "ES",
    "ET",
    "FI",
    "FR",
    "HU",
    "ID",
    "IT",
    "JA",
    "KO",
    "LT",
    "LV",
    "NB",
    "NL",
    "PL",
    "PT",
    "PT-BR",
    "PT-PT",
    "RO",
    "RU",
    "SK",
    "SL",
    "SV",
    "TR",
    "UK",
    "ZH",
  ];

  public constructor(private token: string, private apiType: ApiType = "free") {
    if (!this.token) {
      throw new VendorSetupError(`No token provided.`);
    }
    this.apiUrl =
      apiType === "free"
        ? "https://api-free.deepl.com/v2/translate"
        : "https://api.deepl.com/v2/translate";
  }

  public async translate(
    text: string,
    sourceLocale: string,
    targetLocale: string
  ): Promise<string> {
    this.checkLocales(sourceLocale, targetLocale);

    const res = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ text: text }),
    });

    if (res.status !== 200) {
      throw new TranslationFailedError(`Translation failed for ${text}`);
    }

    return res.json();
  }

  private checkLocales(sourceLocale: string, targetLocale: string): void {
    /**
     * One interesting thing about the deepl vendor is, that it is not required
     * to provide the source locale at all and - even if it is not strictly supported,
     * the API will still try it's best to provide a useful translation.
     *
     * It still makes sense to warn the user about the unsupported locale.
     */
    if (!DeeplVendor.SUPPORTED_SOURCE_LOCALES.includes(sourceLocale)) {
      payload.logger.console.warn(
        `[${Meta.pluginName}] Unsupported source locale for deepl vendor ${sourceLocale}\
        \n\tTry setting up an appropriate 'localeAlias' in your plugin conf.`
      );
    }

    /**
     * This case is more serious. The API will not be able to handle our request, it is best
     * to throw an error and not attempt any translation, as it might yield undesired results.
     */
    if (!DeeplVendor.SUPPORTED_TARGET_LOCALES.includes(targetLocale)) {
      throw new UnsupportedLocaleError(
        `Unsupported target locale ${targetLocale} - aborting.`
      );
    }
  }
}
