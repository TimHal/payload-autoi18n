import { CollectionConfig, Field } from "payload/types";

export const unrollFields = (fields: Field[]) => {
  const ignoreFields = ["ui"];
  const nestedFields = ["tabs", "collapsible", "group", "array"];

  const res = {};

  for (const field of fields) {
    console.log(field);
    if (ignoreFields.includes(field.type)) continue;
    if (nestedFields.includes(field.type)) {
      if (field.type === "tabs") {
        for (const tab of field.tabs) {
          // is it a named tab? That will change the structure of the value!
          const unrolled = unrollFields(tab.fields);
          if (tab["name"]) {
            res[tab["name"]] = {};

            Object.keys(unrolled).forEach((k) => {
              res[tab["name"]][k] = unrolled[k];
            });
          } else {
            // it is not a named tab, in this case just add the unrolled fields top level
            Object.keys(unrolled).forEach((k) => {
              res[k] = unrolled[k];
            });
          }
        }
      }

      if (field.type === "group") {
        const unrolled = unrollFields(field.fields);
        Object.keys(unrolled).forEach((k) => {
          res[k] = unrolled[k];
        });
      }
    }

    // else this is a simple field
    if (field["name"]) {
      res[field["name"]] = field;
    }
  }
  return res;
};

export const unrollTabFields = (fields: Field[]): Field[] => {
  return fields.flatMap((f) => {
    if (f.type === "tabs") {
      return f.tabs.flatMap((tab) => tab.fields);
    }
    return f;
  });
};

export const ttf = (val, locale) => {
  return `${locale} - val`;
};

export const ttaf = (val, locale) => {
  return ttf(val, locale);
};

export const rtf = (val, locale) => {
  return val;
};
