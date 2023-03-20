import { TranslationVendor } from "../../../types";

export class CapitalTranslator implements TranslationVendor {
  constructor() { };

  async translate(text: string, sourceLocale: string, targetLocale: string) {
    return (text as string).toLocaleUpperCase();
  }
}
