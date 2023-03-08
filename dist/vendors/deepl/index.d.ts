import { TranslationVendor } from "../../types";
export declare class DeeplVendor implements TranslationVendor {
    constructor();
    translate(text: string, sourceLocale: string, targetLocale: string): Promise<string>;
}
