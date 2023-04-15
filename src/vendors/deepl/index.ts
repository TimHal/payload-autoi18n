import payload from "payload";
import { Meta } from "../..";
import {
  UnsupportedLocaleError,
  TranslationFailedError,
  VendorSetupError,
} from "../../core/errors";
import {
  SUPPORTED_SOURCE_LOCALES,
  SUPPORTED_TARGET_LOCALES,
} from "./constants";
import qs from "qs";
import { TranslationVendor } from "../../types";

export type ApiType = "free" | "pro";
export class DeeplVendor implements TranslationVendor {
  private apiUrl;

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

    console.log(this.apiUrl);
    const res = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${this.token}`,
        Accept: "application/json, text/plain",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify({ text: text, target_lang: targetLocale }),
    });

    if (res.status !== 200) {
      throw new TranslationFailedError(`Translation failed for ${text}`);
    }

    const json = await res.json();
    const translationResult = json["translations"][0]["text"];
    if (!translationResult) {
      throw new TranslationFailedError(
        `Vendor did not produce a meaningful translation for ${text}`
      );
    }
    return translationResult;
  }

  private checkLocales(sourceLocale: string, targetLocale: string): void {
    /**
     * One interesting thing about the deepl vendor is, that it is not required
     * to provide the source locale at all and - even if it is not strictly supported,
     * the API will still try it's best to provide a useful translation.
     *
     * It still makes sense to warn the user about the unsupported locale.
     */
    if (!SUPPORTED_SOURCE_LOCALES.includes(sourceLocale)) {
      payload.logger.warn(
        `[${Meta.pluginName}] Unsupported source locale ${sourceLocale} for deepl vendor ${sourceLocale}\
        \n\tTry setting up an appropriate 'localeAlias' in your plugin conf.`
      );
    }

    /**
     * This case is more serious. The API will not be able to handle our request, it is best
     * to throw an error and not attempt any translation, as it might yield undesired results.
     */
    if (!SUPPORTED_TARGET_LOCALES.includes(targetLocale)) {
      throw new UnsupportedLocaleError(
        `Unsupported target locale ${targetLocale} - aborting.`
      );
    }
  }
}
