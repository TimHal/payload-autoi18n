# payload-autoi18n

Translate documents at the click of a button. This collab repository is the technical preview for the payload-autoi18n plugin before it gets re-released 
and published to npm. Check out (PayloadCMS)[https://github.com/payloadcms/payload] first, if you don't know yet what this is about. Feel welcome to submit PRs, bug reports or try to implement additional translation vendors.

## Usage
To try out the plugin you can use the provided `demo` payload application or build it and link it to your own projects.
First clone this repository, then just run `yarn build`, the output can be found in the `dist` folder and linked from there.
If you just want to have a brief look into the plugins capabilities go to the `demo/payload-autoi18n-demo` folder. Scroll down to the 
plugin options, uncomment the line with the `vendor` option and fill in your free deepl API key. Now start with `docker compose up -d`.
You can obtain a free deepl API key [here](https://support.deepl.com/hc/en-us/articles/360021200939-DeepL-API-Free).

## Plugin Setup
Options and setup instructions coming soon.

## Conecpts
Coming soon.

## Roadmap

- **Vendors**
  - [x] Deepl
  - [ ] Google Translate
  - [ ] ChatGPT
- **Documentation**
  - [ ] Plugin Setup and options explained
- **Testing and Code quality**

## Support and Feedback
Best way to get in touch is the payloadcms [discord server](https://discord.com/invite/r6sCXqVk3v), alternatively open an issue or discussion on this repo.
