import { NextFunction, Response, Request } from "express";
import { Config } from "payload/config";
import translationHandlerFactory from "./endpoint/translate.endpoint";
import { AutoI18nConfig } from "./types";
import { DeeplVendor } from "./vendors/deepl";

/**
 *
 * @param _incomingAutoI18nConfig
 * @returns
 */
const autoI18nPlugin =
  (_incomingAutoI18nConfig: AutoI18nConfig) =>
  (config: Config): Config => {
    /**
     * This plugin is useless without present localizations
     */
    if (!config.localization) {
      return config;
    }

    const locales = config.localization.locales;
    const defaultLocale = config.localization.defaultLocale;
    const _deepl = new DeeplVendor();

    const mergedConfig = {
      ...config,
      collections: config.collections?.map((collection) => {
        const collectionConfig = config.collections?.find(
          (c) => c.slug === collection.slug
        );
        if (!collectionConfig) {
          throw new Error(`Unable to resolve config for ${collection.slug}`);
        }
        const translationEndpoint = {
          path: "/:id/translate",
          method: "post",
          root: false,
          handler: translationHandlerFactory({
            ..._incomingAutoI18nConfig,
            config: collectionConfig,
            implementedVendor: _deepl,
            collectionSlug: collection.slug,
            locales: locales,
            defaultLocale: defaultLocale,
          }),
        };

        return {
          ...collection,
          endpoints: [...(collection.endpoints ?? []), translationEndpoint],
        };
      }),
    };

    return mergedConfig;
  };

export default autoI18nPlugin;
