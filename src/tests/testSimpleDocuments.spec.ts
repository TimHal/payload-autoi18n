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
        data: input,
        locale: "de",
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

  it("Should translate a richText field", async () => {
    const input = {
      richText: [
        { children: [{ text: "This is some text" }] },
        { children: [{ text: "We can have big" }], type: "h1" },
        { children: [{ text: "Or small" }], type: "h6" },
        { children: [{ text: "Headings" }], type: "h4" },
        { children: [{ text: "Love it!" }] },
      ],
    };

    const expected_richText = {
      de: [
        { children: [{ text: "This is some text" }] },
        { children: [{ text: "We can have big" }], type: "h1" },
        { children: [{ text: "Or small" }], type: "h6" },
        { children: [{ text: "Headings" }], type: "h4" },
        { children: [{ text: "Love it!" }] },
      ],
      en: [
        { children: [{ text: "THIS IS SOME TEXT" }] },
        { children: [{ text: "WE CAN HAVE BIG" }], type: "h1" },
        { children: [{ text: "OR SMALL" }], type: "h6" },
        { children: [{ text: "HEADINGS" }], type: "h4" },
        { children: [{ text: "LOVE IT!" }] },
      ],
      es: [
        { children: [{ text: "THIS IS SOME TEXT" }] },
        { children: [{ text: "WE CAN HAVE BIG" }], type: "h1" },
        { children: [{ text: "OR SMALL" }], type: "h6" },
        { children: [{ text: "HEADINGS" }], type: "h4" },
        { children: [{ text: "LOVE IT!" }] },
      ],
    };

    const id = (
      await payload.create({
        collection: simpleCollectionSlug,
        data: input,
        locale: "de",
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

    expect(res["richText"]).toMatchObject(expected_richText);
  });
});
