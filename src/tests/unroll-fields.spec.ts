import { Field } from "payload/dist/fields/config/types";
import unrollFields from "../core/unrollFields";

describe("Field unrolling", () => {
  it("Should not unroll top-level translatable fields", () => {
    const input: Field[] = [
      {
        type: "text",
        name: "text",
        localized: true,
      },
      {
        name: "textarea",
        type: "textarea",
        localized: true,
      },
      {
        name: "richText",
        type: "richText",
        localized: true,
      },
    ];

    const result = unrollFields(input);
    expect(result).toMatchObject(input);
  }),
    it("Should unroll named and unnamed tab fields accordingly", () => {
      const input: Field[] = [
        {
          type: "tabs",
          tabs: [
            {
              name: "tab1",
              fields: [
                {
                  name: "unnamedText",
                  type: "text",
                  localized: true,
                },
              ],
            },
            {
              label: "foo",
              fields: [],
            },
          ],
        },
      ];
    });

  it("Should unroll nested fields", () => {});

  it("Should not crash on empty field lists", () => {});
});
