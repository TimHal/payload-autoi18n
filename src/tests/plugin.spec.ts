import express, { application } from "express";
import payload from "payload";
import { simpleCollectionSlug } from "./configs/simple/payload-config";

describe("AutoI18n Plugin Tests", () => {
  beforeAll(async () => {
    process.env["PAYLOAD_CONFIG_PATH"] =
      "src/tests/configs/simple/payload-config.ts";

    const app = express();
    app.listen(3000);
    if (process.env["MONGO_URL"]) {
      console.log(`Running in docker mode ${process.env["MONGO_URL"]}`)
      await payload.init({
        secret: "SECRET",
        express: app,
        mongoURL: process.env["MONGO_URL"],
      })
    }

  });

  it("Should translate a simple entity", async () => {
    const input = {
      text: "foo",
    };

    const expected_text = {
      de: "foo",
      en: "FOO",
      es: "FOO",
    };

    const id = (
      await payload.create({
        collection: simpleCollectionSlug,
        data: {
          text: "foo",
        },
        locale: "de",
        overrideAccess: true,
      })
    ).id;

    // query the translation endpoint
    await fetch(
      `http://localhost:3000/api/${simpleCollectionSlug}/${id}/translate?locale=de&id=${id}`,
      {
        method: "post",
      }
    );

    const res = await payload.findByID({
      collection: simpleCollectionSlug,
      id: id,
      locale: "all",
    });

    expect(res["text"]).toMatchObject(expected_text);
  });
});
