import { TranslationVendor } from "../../../types";
export declare class CapitalTranslator implements TranslationVendor {
    constructor();
    translate(text: string, sourceLocale: string, targetLocale: string): Promise<string>;
}
