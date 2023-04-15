import { NextFunction, Request, RequestHandler, Response } from "express";
import { PayloadHandler } from "payload/config";
import { CollectionConfig } from "payload/dist/collections/config/types";
import { PayloadRequest } from "payload/dist/types";
import translateDocument from "../core/documentTranslator";
import {
  AutoI18nConfig,
  locale,
  TranslationArgs,
  TranslationVendor,
} from "../types";

export type FactoryArgs = {
  vendor: TranslationVendor;
  collectionSlug: string;
  config: CollectionConfig;
  locales: string[];
};

type RequestParams = {
  fields?: string[];
  sourceLocale: locale;
  targetLocale: locale | locale[];
};

const translationHandlerFactory: (
  args: AutoI18nConfig & {
    implementedVendor: TranslationVendor;
    config: CollectionConfig;
    collectionSlug: string;
    locales: string[];
    localeAlias: Record<string, string>;
    defaultLocale: string;
  }
) => PayloadHandler = (
  args: AutoI18nConfig & {
    implementedVendor: TranslationVendor;
    config: CollectionConfig;
    collectionSlug: string;
    locales: string[];
    localeAlias: Record<string, string>;
    defaultLocale: string;
  }
) => {
  return async (req: PayloadRequest, res: Response, next: NextFunction) => {
    const { id, locale } = req.query;

    if (!id) {
      res.status(406).send();
      return;
    }

    const sourceLocale = locale ?? args.defaultLocale;

    await translateDocument(
      id as string,
      args.collectionSlug,
      args.config,
      args.implementedVendor,
      sourceLocale as string,
      args.locales,
      args.localeAlias,
      args.overwriteTranslations,
      []
    );

    // check the auth constraints, if any
    res.status(200).send({ status: "ok" });
  };
};

export default translationHandlerFactory;
