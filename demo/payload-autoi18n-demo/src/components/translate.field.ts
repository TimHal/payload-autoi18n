import { Field } from "payload/types";
import translateComponent from "./translate.component";

const TranslationButton: Field = {
  name: "translationButton",
  type: "ui",
  admin: {
    components: {
      Field: translateComponent,
    },
    position: "sidebar",
  },
};

export default TranslationButton;
