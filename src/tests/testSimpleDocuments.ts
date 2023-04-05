import express from "express";
import { Server } from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import payload from "payload";
import { simpleCollectionSlug } from "./configs/simple/payload-config";

let handle: Server;

describe("AutoI18n - Simple Documents", () => {
  beforeAll(async () => {
    process.env["PAYLOAD_CONFIG_PATH"] =
      "src/tests/configs/simple/payload-config.ts";

    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const app = express();
    handle = app.listen(3000);

    await payload.init({
      secret: "SECRET",
      express: app,
      mongoURL: uri,
    });
  });

  afterAll(() => {
    handle.close();
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
