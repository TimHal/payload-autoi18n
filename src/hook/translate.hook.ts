import {
  AfterChangeHook,
  CollectionConfig,
} from "payload/dist/collections/config/types";
import translateDocument from "../core/documentTranslator";
import { AutoI18nConfig, TranslationVendor } from "../types";

const translateHookFactory: (
  args: AutoI18nConfig & {
    implementedVendor: TranslationVendor;
    config: CollectionConfig;
    collectionSlug: string;
    locales: string[];
    defaultLocale: string;
  }
) => AfterChangeHook = (args) => {
  const hook: AfterChangeHook = async ({ req, doc }) => {
    const { locale } = req;
    const { id } = doc;

    if (!id) return doc;

    // Not able to choose the correct source locale in this case.
    // Theoretically it _might_ be possible to compare `doc` to `previousDoc`
    // and diff the content + check the collection config if the changed fields
    // are localized, but that seems like a lot of work for very little benefit.
    if (!locale) return doc;

    await translateDocument(
      id as string,
      args.collectionSlug,
      args.config,
      args.implementedVendor,
      locale as string,
      args.locales,
      args.overwriteTranslations,
      []
    );

    // Return the `true` doc (with original locale selected) to not
    // interfere with other hooks
    return doc;
  };

  return hook;
};

export default translateHookFactory;
