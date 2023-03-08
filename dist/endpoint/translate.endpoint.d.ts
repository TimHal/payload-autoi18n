import { NextFunction, Response } from "express";
import { CollectionConfig } from "payload/dist/collections/config/types";
import { PayloadRequest } from "payload/dist/types";
import { AutoI18nConfig, TranslationVendor } from "../types";
export type FactoryArgs = {
    vendor: TranslationVendor;
    collectionSlug: string;
    config: CollectionConfig;
    locales: string[];
};
declare const translationHandlerFactory: (args: AutoI18nConfig & {
    implementedVendor: TranslationVendor;
    config: CollectionConfig;
    collectionSlug: string;
    locales: string[];
    defaultLocale: string;
}) => (req: PayloadRequest, res: Response, next: NextFunction) => Promise<void>;
export default translationHandlerFactory;
