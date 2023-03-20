import { Config } from "payload/config";
import { AutoI18nConfig } from "./types";
import { DeeplVendor } from "./vendors/deepl";
/**
 * Export default vendors
 */
export { DeeplVendor };
/**
 *
 * @param _incomingAutoI18nConfig
 * @returns
 */
declare const autoI18nPlugin: (_incomingAutoI18nConfig: AutoI18nConfig) => (config: Config) => Config;
export default autoI18nPlugin;
