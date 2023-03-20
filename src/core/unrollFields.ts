// import { Field } from "payload/dist/fields/config/types";
// import { traversableFieldTypes } from "../types";

// const unrollFields = (fields: Field[]): Field[] => {
//   return fields.flatMap((field: Field) => {
//     if (traversableFieldTypes.includes(field.type)) {
//       // unroll unnamed tabs on top level
//       if (field.type === "tabs") {
//         for (const tab of field.tabs) {
//           if ((tab as any)["name"]) {
//             // named fields will receive their own namespace
//             continue;
//           } else {
//             return tab.fields;
//           }
//         }
//       }
//       if (field.type === "row") {
//       } else {
//         return [];
//       }
//     } else {
//       return field;
//     }
//   });
// };

// export default unrollFields;
