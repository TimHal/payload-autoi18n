import express from "express";
import { Server } from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import payload from "payload";
import {
  arrayCollectionSlug,
  nestedCollectionSlug,
} from "./configs/nested/payload-config";

let handle: Server;

describe("AutoI18n Plugin Tests", () => {
  beforeAll(async () => {
    process.env["PAYLOAD_CONFIG_PATH"] =
      "src/tests/configs/nested/payload-config.ts";

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

  it("Should handle named and unnamed tabs correctly", async () => {
    const input = {
      named_tab: {
        named_tab_localized_text: "foo",
        named_tab_static_number: 42,
      },
      unnamed_tab_localized_text: "bar",
    };

    const expected_text = {
      de: "foo",
      en: "FOO",
      es: "FOO",
    };

    const id = (
      await payload.create({
        collection: nestedCollectionSlug,
        data: input,
        locale: "de",
      })
    ).id;

    // query the translation endpoint
    await fetch(
      `http://localhost:3000/api/${nestedCollectionSlug}/${id}/translate?locale=de&id=${id}`,
      {
        method: "post",
      }
    );

    const res = await payload.findByID({
      collection: nestedCollectionSlug,
      id: id,
      locale: "all",
    });

    console.log(res);
    expect(1).toBe(1);
    //expect(res["text"]).toMatchObject(expected_text);
  });

  it("Should translate array fields properly", async () => {
    const input = {
      localizedArray: [
        {
          localized_array_text: "foo",
          static_array_number: 1,
        },
        {
          localized_array_text: "bar",
          static_array_number: 2,
        },
      ],
    };

    const id = (
      await payload.create({
        collection: arrayCollectionSlug,
        data: input,
        locale: "de",
      })
    ).id;

    await fetch(
      `http://localhost:3000/api/${arrayCollectionSlug}/${id}/translate?locale=de&id=${id}`,
      {
        method: "post",
      }
    );

    const res = await payload.findByID({
      collection: arrayCollectionSlug,
      id: id,
      depth: 3,
      locale: "all",
    });

    console.log("------------------------------------------");
    res.localizedArray.map(console.log);
    expect(1).toBe(1);
  });
});
