import { Config } from "payload/config";
import translationHandlerFactory from "./endpoints/translate.endpoint";
import translateHookFactory from "./hooks/translate.hook";
import { AutoI18nConfig } from "./types";

/**
 * Payload-autoi18n Plugin (Technical Preview)
 *
 * Author: Tim Hallyburton
 * License: GPLv3
 *
 * This plugin adds automatic translation capabilities to your payload project using a vendor of your choice.
 * It is tested for simple and nested documents, using a mock- translator and the free DeepL API.
 * For more information and example usage see the `demo` folder in this repository.
 *
 * Please note: This plugin is not authored, endorsed or approved by the payload project,
 * associated developers or legal entities.
 */

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

    /**
     * Prepare the locale aliasing. All explicit alias entries are untouched while
     * any ommited locales are aliased to their identity. This makes the implementation
     * down the line more straight forward as it does not require to distinguish
     * between aliased and un-aliased locales.
     */
    const localeAlias = _incomingAutoI18nConfig.localeAlias ?? {};
    for (const locale of locales) {
      if (locale in localeAlias) continue;

      localeAlias[locale] = locale;
    }

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
              localeAlias: localeAlias,
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
            localeAlias: localeAlias,
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

/**
 * This meta information is not really needed right now, but it would be useful to establish such meta information
 * for the upcoming plugin ecosystem. Will discuss this with the other contributors soon.
 */
const Meta = {
  pluginName: "auto-i18n",
  pluginId: "",
  author: "Tim Hallyburton",
  version: "0.1.0",
  compatiblePayloadVersions: [">1.6.*"],
  incompatibleWith: [],
};

export default autoI18nPlugin;
