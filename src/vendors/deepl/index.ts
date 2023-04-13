import { TranslationVendor } from "../../types";

export class DeeplVendor implements TranslationVendor {
  private token: string;

  constructor(args: { token: string }) {
    this.token = args.token;
  }

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
