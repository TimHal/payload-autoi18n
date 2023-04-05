import express from "express";
import { Server } from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import payload from "payload";
import { simpleCollectionSlug } from "./configs/synchro/payload-config";

let handle: Server;
let url: string;

describe("AutoI18n - Synchronization", () => {
  /**
   * Note that in this test suite we are working with `synchronize` and `overwriteTranslations` set to true.
   * The latter option is useful to reduce the amount of required tests for the synchronization process.
   */
  beforeAll(async () => {
    process.env["PAYLOAD_CONFIG_PATH"] =
      "src/tests/configs/synchro/payload-config.ts";

    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const app = express();
    handle = app.listen(3000);

    await payload.init({
      secret: "SECRET",
      express: app,
      mongoURL: uri,
    });
    const { port } = handle.address() as any;
    url = `http://localhost:${port}${payload.getAPIURL()}`;
    console.log(url);
  });

  afterAll(() => {
    handle.close();
  });

  it("Should synchronize and overwrite as expected", async () => {
    const input = {
      text: "foo",
    };

    const res = await (
      await fetch(`${url}/${simpleCollectionSlug}?locale='en'`, {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      })
    ).json();

    let doc = await payload.findByID({
      collection: simpleCollectionSlug,
      id: res.doc.id,
      locale: "all",
    });

    expect(doc.text).toMatchObject({ de: "FOO", en: "foo", es: "FOO" });

    // Now update a different locale and see how the document reacts
    const u = await fetch(
      `${url}/${simpleCollectionSlug}/${doc.id}?locale=es`,
      {
        method: "patch",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: "updated!" }),
      }
    );

    doc = await payload.findByID({
      collection: simpleCollectionSlug,
      id: res.doc.id,
      locale: "all",
    });

    expect(doc.text).toMatchObject({
      de: "UPDATED!",
      en: "UPDATED!",
      es: "updated!",
    });
  });
});
