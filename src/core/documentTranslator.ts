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
  let translationPatch: Record<string, any> = {};

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

      // check if the field is named and values are scoped
      const currFieldName: string =
        (field as any & { name: string }).name ?? undefined;
      const currFieldValue = currFieldName ? document[currFieldName] : document;
      const targetFieldValue = currFieldName
        ? targetDocument[currFieldName]
        : targetDocument;

      const translationResult = await translateField({
        value: currFieldValue,
        targetValue: targetFieldValue,
        field: field,
        vendor: vendor,
        sourceLocale: sourceLocale,
        targetLocale: locale,
        overwriteExistingTranslations: overwriteExistingTranslations,
      });

      if (translationResult) {
        // the patch for this current field
        translationPatch = { ...translationPatch, ...translationResult };
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
 * @param targetValue
 * @param vendor
 * @param sourceLocale
 * @param targetLocale
 *
 * @returns Partial<TranslationPatch> the recursive translation patch for the given field
 */
const translateField = async (
  args: TranslationArgs
): Promise<undefined | Record<string, any>> => {
  const {
    value,
    targetValue,
    field,
    vendor,
    sourceLocale,
    targetLocale,
    overwriteExistingTranslations,
  } = args;

  console.log(args);

  // if this is a directly translatable field, return the vendor's result
  // wrapped in an object of the field's name to be directly applied as
  // partial translation patch
  if (translatableFieldTypes.includes(field.type)) {
    if (!value) return undefined;
    // only consider localized fields
    if (!(field as any)["localized"]) return value;
    if (targetValue && !overwriteExistingTranslations) {
      return { [(field as any).name]: targetValue };
    }

    let translation;

    switch (field.type) {
      case "text":
        translation = await translateTextField({ ...args, text: value });
        break;
      case "textarea":
        translation = await translateTextareaField({
          ...args,
          text: value,
        });
        break;
      case "richText":
        translation = await translateRichtextField({
          ...args,
          node: value,
        });
        break;
      default:
        // this should never happen as the switch-cases fully matches `translatableFields`
        throw new Error(
          `Undefined 'translatableField': ${field.type} - aborting!`
        );
    }

    return {
      [field.name]: translation,
    };
  }
  //
  else if (traversableFieldTypes.includes(field.type)) {
    let translationPatch: Record<string, any> = {};

    switch (field.type) {
      case "tabs":
        // For tabs we need to distinguish between named and unnamed tabs
        // because named tabs have their values namespaced while unnamed tabs
        // put their value on top-level
        for (const tab of field.tabs) {
          if ((tab as any)["name"]) {
            // This is a named tab.
            // Descend into the namespace and translate fields.
            const tabName = (tab as any)["name"];
            let tabTranslationResult = {};
            for (const tabField of tab.fields) {
              const fieldName = (tabField as any).name ?? undefined;
              const tabFieldTranslationResult = await translateField({
                ...args,
                field: tabField,
                value: fieldName ? value[tabName][fieldName] : value[tabName],
                targetValue: fieldName
                  ? targetValue[tabName][fieldName]
                  : targetValue[tabName],
              });

              if (tabFieldTranslationResult) {
                tabTranslationResult = {
                  ...tabTranslationResult,
                  ...tabFieldTranslationResult,
                };
              }
            }
            translationPatch = {
              ...translationPatch,
              [tabName]: tabTranslationResult,
            };
          } else {
            // This is an unnamed tab.
            for (const tabField of tab.fields) {
              const fieldName = (tabField as any)["name"] ?? undefined;
              const tabFieldTranslationResult = await translateField({
                ...args,
                field: tabField,
                value: fieldName ? value[fieldName] : value,
                targetValue: fieldName ? targetValue[fieldName] : targetValue,
              });

              if (tabFieldTranslationResult) {
                translationPatch = {
                  ...translationPatch,
                  ...tabFieldTranslationResult,
                };
              }
            }
          }
        }
        return translationPatch;

      case "array":
        // For arrays it is required to translate each entry.
        // The contents are name-spaced under the array's name.
        // The type of value is expected to be an array (or undefined)
        const arrayName = field.name;

        const fn = async (value: any, index: number) => {
          // Index is needed to get the corresponding element in the target array
          let elementTranslation = {};
          const targetDocumentElementValue =
            (targetValue[arrayName] as any[])[index] ?? undefined;

          for (const _field of field.fields) {
            const _fieldPatch = await translateField({
              ...args,
              value: value,
              targetValue: (targetValue[arrayName] as any[]) ?? [],
            });
          }
        };

        // Apply the same translation config to all elements
        const arrayTranslationResult = Promise.all(
          (value[arrayName] as any[]).map(fn)
        );

        let arrayFieldTranslationPatch;

        break;

      case "group":
      case "collapsible":
      case "row":
        // Groups, Rows and collapsibles do not really change the structure, just namespace the
        // values in question.
        break;

      default:
        // this should never happen as the switch-cases fully matches `traversableFields`
        throw new Error(
          `Undefined 'traversableFields': ${field.type} - aborting!`
        );
    }
  } else {
    // The field is neither translatable, nor traversable.
    // This means it might be something like a number or date field and no operation is required.
    // It might also indicate an unsupported field type which is not handled.
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
