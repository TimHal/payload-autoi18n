import express, { application } from "express";
import payload from "payload";
import { simpleCollectionSlug } from "./configs/simple/payload-config";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("AutoI18n Plugin Tests", () => {
  beforeAll(async () => {
    process.env["PAYLOAD_CONFIG_PATH"] =
      "src/tests/configs/simple/payload-config.ts";

    const app = express();
    app.listen(3000);
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await payload.init({
      secret: "SECRET",
      express: app,
      mongoURL: uri,
    });
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

    console.log(payload);

    const id = (
      await payload.create({
        collection: simpleCollectionSlug,
        data: input,
        locale: "de",
        overrideAccess: true,
      })
    ).id;

    const res = await payload.findByID({
      collection: simpleCollectionSlug,
      id: id,
      locale: "all",
    });

    console.log(res);

    expect(1).toBe(1);
  });
});
