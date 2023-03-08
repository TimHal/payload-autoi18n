import { TranslationVendor } from "../../types";

export class DeeplVendor implements TranslationVendor {
  constructor() {}

  public async translate(
    text: string,
    sourceLocale: string,
    targetLocale: string
  ): Promise<string> {
    console.log(
      `deepl[translating (${sourceLocale} - ${targetLocale})]: ${text} `
    );
    return "foo";
  }
}
