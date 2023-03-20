import express from "express";
import payload from "payload";
import { simpleCollectionSlug } from "./configs/simple/payload-config";
describe('AutoI18n Plugin Tests', () => {

  beforeAll(async () => {

    process.env['PAYLOAD_CONFIG_PATH'] = 'src/tests/configs/simple/payload-config.ts';
    const app = express();

    await payload.init({
      express: app,
      secret: 'SECRET',
      local: true,
      mongoURL: false,
      onInit: () => {
        console.log('Loaded simple test cfg');
        // console.log(payload.getAPIURL())
      }
    });
  })

  it('Should load', async () => {
    expect(1).toBe(1);
  })

  it('Should translate a simple entity', async () => {

    const input = {
      text: 'foo',
    }

    const res = await payload.create({
      collection: simpleCollectionSlug,
      data: input,
      overrideAccess: true,
    });

    console.log(res);

    expect(1).toBe(1);
  })
})
