import { Meta } from "..";

class VendorSetupError extends Error {
  constructor(msg: string) {
    super(`[${Meta.pluginName}]` + msg);
  }
}

class UnsupportedLocaleError extends Error {
  constructor(msg: string) {
    super(`[${Meta.pluginName}]` + msg);
  }
}

class TranslationFailedError extends Error {
  constructor(msg: string) {
    super(`[${Meta.pluginName}]` + msg);
  }
}

export { UnsupportedLocaleError, TranslationFailedError, VendorSetupError };
