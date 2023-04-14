import { NextFunction, Response, Request } from "express";
import { Config } from "payload/config";
import { Field } from "payload/dist/fields/config/types";
import translationHandlerFactory from "./endpoints/translate.endpoint";
import translateHookFactory from "./hooks/translate.hook";
import { AutoI18nConfig } from "./types";
import { DeeplVendor } from "./vendors/deepl";

/**
 * Export default vendors and meta information
 */
// export class DeeplVendor;
export { Meta };

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

    const mergedConfig = {
      ...config,
      collections: config.collections
        ?.map((collection) => {
          /**
           * Create the default REST endpoints for document translations.
           */
          const collectionConfig = config.collections?.find(
            (c) => c.slug === collection.slug
          );
          if (!collectionConfig) {
            throw new Error(`Unable to resolve config for ${collection.slug}`);
          }
          if (
            (_incomingAutoI18nConfig.endpointConfig?.omitEndpoints ?? false) ===
            true
          ) {
            return {
              ...collection,
            };
          }
          const translationEndpoint = {
            path:
              _incomingAutoI18nConfig.endpointConfig?.path ?? "/:id/translate",
            method: "post",
            root: false,
            handler: translationHandlerFactory({
              ..._incomingAutoI18nConfig,
              config: collectionConfig,
              implementedVendor: _incomingAutoI18nConfig.vendor,
              collectionSlug: collection.slug,
              locales: locales,
              defaultLocale: defaultLocale,
            }),
          };

          return {
            ...collection,
            endpoints: [...(collection.endpoints ?? []), translationEndpoint],
          };
        })
        .map((collection) => {
          /**
           * Create synchronization hooks for the collections
           */
          const collectionConfig = config.collections?.find(
            (c) => c.slug === collection.slug
          );
          if (!collectionConfig) {
            throw new Error(`Unable to resolve config for ${collection.slug}`);
          }

          if ((_incomingAutoI18nConfig.synchronize ?? false) !== true) {
            return {
              ...collection,
            };
          }

          const synchronizationHook = translateHookFactory({
            ..._incomingAutoI18nConfig,
            config: collectionConfig,
            implementedVendor: _incomingAutoI18nConfig.vendor,
            collectionSlug: collection.slug,
            locales: locales,
            defaultLocale: defaultLocale,
          });

          return {
            ...collection,
            hooks: {
              ...collection.hooks,
              afterChange: [
                ...(collection.hooks?.afterChange ?? []),
                synchronizationHook,
              ],
            },
          };
        }),
    };

    return mergedConfig;
  };

const Meta = {
  pluginName: "auto-i18n",
  pluginId: "",
  author: "Tim Hallyburton",
  version: "0.1.0",
  compatiblePayloadVersions: [">1.6.*"],
  incompatibleWith: [],
};

export default autoI18nPlugin;
