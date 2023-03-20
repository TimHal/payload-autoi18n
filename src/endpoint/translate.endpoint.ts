import { NextFunction, Request, RequestHandler, Response } from "express";
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

const translationHandlerFactory = (
  args: AutoI18nConfig & {
    implementedVendor: TranslationVendor;
    config: CollectionConfig;
    collectionSlug: string;
    locales: string[];
    defaultLocale: string;
  }
) => {
  return async (req: PayloadRequest, res: Response, next: NextFunction) => {
    const { id } = req.query;
    console.log(req);
    console.log(req.query);
    if (!id) {
      res.status(406).send();
      return;
    }

    const sourceLocale = req.locale ?? args.defaultLocale;

    await translateDocument(
      id as string,
      args.collectionSlug,
      args.config,
      args.implementedVendor,
      sourceLocale as string,
      args.locales,
      args.overwriteTranslations,
      []
    );

    // check the auth constraints, if any
    console.log("translating!");
    res.status(200).send({ status: "ok" });
  };
};

export default translationHandlerFactory;
