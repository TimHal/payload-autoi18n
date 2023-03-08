import "payload";
import { CollectionConfig } from "payload/dist/collections/config/types";
import { locale, TranslationVendor } from "../types";
/**
 * Recursively translates a whole document by traversing the field hierarchy.
 *
 * At each step the type of the current field is inspected, given the `collectionConfig`.
 * If the field is easily translatable (text, textarea, richText) all translations of the
 * target locales are requested from the vendor and merged together. The result can then
 * be patched using payload's update method.
 *
 * Note: Instead of passing the document directly, it is easier to specify the slug and id
 * separately, as the collection might describe a custom id (with a custom name to it).
 *
 * @param documentId
 * @param documentSlug
 * @param collectionConfig
 * @param vendor
 * @param sourceLocale
 * @param targetLocale
 * @param overwriteExistingTranslations
 * @param excludePaths
 *
 * @returns the updated document
 */
declare const translateDocument: (documentId: string, documentSlug: string, collectionConfig: CollectionConfig, vendor: TranslationVendor, sourceLocale: locale, targetLocale: locale | locale[], overwriteExistingTranslations: boolean, excludePaths?: string[]) => Promise<any>;
export default translateDocument;
