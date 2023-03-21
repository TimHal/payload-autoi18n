import { Field, NamedTab } from "payload/dist/fields/config/types";
import { traversableFieldTypes } from "../types";

/**
 * This method elevates top-level translatable fields and helps with the
 * recursive descend translation process later on.
 *
 * Basically it takes a (sub) list of fields and flattens it to a format
 * which can be applied as translation patch.
 *
 * @param fields
 * @returns
 */
const unrollFields = (fields: Field[]): Array<Field | NamedTab> => {
  const res: Array<Field | NamedTab> = fields.flatMap((field: Field) => {
    if (traversableFieldTypes.includes(field.type)) {
      // unroll unnamed tabs on top level
      if (field.type === "tabs") {
        for (const tab of field.tabs) {
          if ((tab as any)["name"]) {
            // named fields will receive their own namespace
            return tab;
          } else {
            return tab.fields;
          }
        }
      }
      if (field.type === "row") {
        return field.fields;
      } else {
        return [];
      }
    } else {
      // the current field type is not traversable, just return it
      return field;
    }
  });

  return res;
};

export default unrollFields;
