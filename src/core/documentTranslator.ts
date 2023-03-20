import "payload";
import { CollectionConfig } from "payload/dist/collections/config/types";
import {
  locale,
  supportedFieldTypes,
  translatableFieldTypes,
  TranslationArgs,
  TranslationVendor,
  traversableFieldTypes,
} from "../types";
import payload from "payload";
import handleAndRethrow from "./errorHandler";
import { Field } from "payload/dist/fields/config/types";

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
const translateDocument = async (
  documentId: string,
  documentSlug: string,
  collectionConfig: CollectionConfig,
  vendor: TranslationVendor,
  sourceLocale: locale,
  targetLocale: locale | locale[],
  overwriteExistingTranslations: boolean,
  excludePaths?: string[]
) => {
  // this object keeps the records to update in the final step
  const translationPatch: Record<string, any> = {};

  console.log(sourceLocale);
  // get the original doc. `showHiddenFields = true` is a sensible default, because undesired
  // fields can be ommited using `excludePaths`.
  const document = await payload
    .findByID({
      id: documentId,
      collection: documentSlug,
      locale: sourceLocale,
      // showHiddenFields: true,
      overrideAccess: true,
    })
    .catch(handleAndRethrow);

  // sanitize and unify the target locales field -> cast it to array and assure the source locale
  // is not part of it
  const _targetLocales = Array.from(targetLocale).filter(
    (l) => l !== sourceLocale
  );
  if (_targetLocales.length === 0 || !sourceLocale) return;

  console.log(_targetLocales);

  for (const locale of _targetLocales) {
    /**
     * Fetch the target document to prevent overriding values (if applicable).
     * The solution with fetching locale "*" does not work reliable, so this approach
     * is more secure.
     * It is a bit slower as more queries are sent to the db, but since all of these are
     * local requests it should
     */
    const targetDocument = await payload.findByID({
      id: documentId,
      collection: documentSlug,
      locale: locale,
      showHiddenFields: true,
      depth: 0,
    });

    for (const field of collectionConfig.fields) {
      // it is not possible to provide meaningful translations for relationship fields, ui fields
      // or some other data types - do not process those fields.
      // supported fields include any text fields or containers which include other (possibly translatable)
      // subfields.
      if (!supportedFieldTypes.includes(field.type)) continue;

      // make sure this is a named field, otherwise it is not possible to resolve or update
      if (!Object.keys(field).includes("name")) continue;

      const currFieldName: string = (field as any & { name: string }).name;
      const currFieldValue = document[currFieldName];

      // to determine how the field can be translated and updated we need to check it's config
      // if the config should not be available skip the translation
      const fieldConfig: Field & { name: string } & any =
        collectionConfig.fields.find(
          (cfg: any & { name: string }) => cfg.name === currFieldName
        );
      if (!fieldConfig) continue;
      if (!fieldConfig.name) continue;

      // if it is a simple (top-level) translatable field and a value is given
      // on the target document we skip if overwrites are disabled
      if (
        overwriteExistingTranslations === false &&
        translatableFieldTypes.includes(fieldConfig.type) &&
        targetDocument[fieldConfig.name]
      )
        continue;

      const translationResult = await translateField({
        value: currFieldValue,
        field: fieldConfig,
        vendor: vendor,
        sourceLocale: sourceLocale,
        targetLocale: locale,
        overwriteExistingTranslations: overwriteExistingTranslations,
      });

      if (translationResult) {
        // the patch for this current field
        translationPatch[currFieldName] = translationResult;
      }
    }

    console.log(translationPatch);

    // finally, apply the translation patch to the object for the current locale
    await payload.update({
      id: documentId,
      locale: locale,
      collection: documentSlug,
      data: translationPatch,
    });
  }
};

/**
 * Translates a given field of a supported type.
 *
 * @param value
 * @param vendor
 * @param sourceLocale
 * @param targetLocale
 */
const translateField = async (args: TranslationArgs) => {
  const {
    value,
    field,
    vendor,
    sourceLocale,
    targetLocale,
    overwriteExistingTranslations,
  } = args;

  // if this is a directly translatable field, return the vendor's result
  if (translatableFieldTypes.includes(field.type)) {
    console.log(value);
    if (!value) return undefined;

    switch (field.type) {
      case "text":
        return await translateTextField({ ...args, text: value });
      case "textarea":
        return await translateTextareaField({
          ...args,
          text: value,
        });
      case "richText":
        return await translateRichtextField({
          ...args,
          node: value,
        });
      default:
        // this should never happen as the switch-cases fully matches `translatableFields`
        break;
    }
  }
  //
  if (traversableFieldTypes.includes(field.type)) {
  }
};

const translateTextField = async (args: TranslationArgs & { text: string }) => {
  return await args.vendor.translate(
    args.text,
    args.sourceLocale,
    args.targetLocale
  );
};
const translateTextareaField = async (
  args: TranslationArgs & { text: string }
) => {
  return await args.vendor.translate(
    args.text,
    args.sourceLocale,
    args.targetLocale
  );
};
const translateRichtextField = async (
  args: TranslationArgs & { node: any }
) => {
  const {
    node,
    value,
    field,
    vendor,
    sourceLocale,
    targetLocale,
    overwriteExistingTranslations,
  } = args;

  return node;
};

export default translateDocument;
