import express from "express";
import { Server } from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import payload from "payload";
import {
  arrayCollectionSlug,
  nestedCollectionSlug,
  representationalCollectionSlug,
  structuralCollectionSlug,
} from "./configs/nested/payload-config";

let handle: Server;
let url: string;

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
    const { port } = handle.address() as any;
    url = `http://localhost:${port}${payload.getAPIURL()}`;
    console.log(url);
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
      `${url}/${nestedCollectionSlug}/${id}/translate?locale=de&id=${id}`,
      {
        method: "post",
      }
    );

    const res = await payload.findByID({
      collection: nestedCollectionSlug,
      id: id,
      locale: "all",
    });

    expect(res.named_tab).toMatchObject({
      named_tab_localized_text: { de: "foo", en: "FOO", es: "FOO" },
      named_tab_static_number: 42,
    });
    expect(res.unnamed_tab_localized_text).toMatchObject({
      de: "bar",
      en: "BAR",
      es: "BAR",
    });
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
      `${url}/${arrayCollectionSlug}/${id}/translate?locale=de&id=${id}`,
      {
        method: "post",
      }
    );

    const res = await payload.findByID({
      collection: arrayCollectionSlug,
      id: id,
      locale: "all",
    });

    expect(res.localizedArray.length).toBe(2);
    expect(res.localizedArray[0]).toMatchObject({
      localized_array_text: { de: "foo", en: "FOO", es: "FOO" },
      static_array_number: 1,
    });
    expect(res.localizedArray[1]).toMatchObject({
      localized_array_text: { de: "bar", en: "BAR", es: "BAR" },
      static_array_number: 2,
    });
  });

  it("Should translate grouped fields correctly", async () => {
    const input = {
      locals: {
        group_localized_text: "foo",
        group_static_text: "static",
      },
      nonlocals: {
        group_nonlocal_static_text: "static",
      },
    };

    const id = (
      await payload.create({
        collection: structuralCollectionSlug,
        data: input,
        locale: "de",
      })
    ).id;

    await fetch(
      `${url}/${structuralCollectionSlug}/${id}/translate?locale=de&id=${id}`,
      {
        method: "post",
      }
    );

    const res = await payload.findByID({
      collection: structuralCollectionSlug,
      id: id,
      locale: "all",
    });

    expect(res.locals).toMatchObject({
      group_localized_text: { de: "foo", en: "FOO", es: "FOO" },
      group_static_text: "static",
    });
    expect(res.nonlocals).toMatchObject({
      group_nonlocal_static_text: "static",
    });
  });

  it("Should translate representational fields (row, collapse) correctly", async () => {
    const input = {
      row_localized_text: "foo",
      row_static_number: 1,
      collapsible_localized_text: "bar",
      collapsible_static_text: "static",
    };

    const id = (
      await payload.create({
        collection: representationalCollectionSlug,
        data: input,
        locale: "de",
      })
    ).id;

    await fetch(
      `${url}/${representationalCollectionSlug}/${id}/translate?locale=de&id=${id}`,
      {
        method: "post",
      }
    );

    const res = await payload.findByID({
      collection: representationalCollectionSlug,
      id: id,
      locale: "all",
    });

    expect(res).toMatchObject({
      row_localized_text: { de: "foo", en: "FOO", es: "FOO" },
      row_static_number: 1,
      collapsible_localized_text: { de: "bar", en: "BAR", es: "BAR" },
      collapsible_static_text: "static",
    });
  });
});
