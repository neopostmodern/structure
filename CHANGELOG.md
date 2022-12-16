# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.22.1](https://github.com/neopostmodern/structure/compare/v0.22.0...v0.22.1) (2022-12-16)


### Bug Fixes

* **client:** don't treat key presses on textarea as shortcuts ([1380e07](https://github.com/neopostmodern/structure/commit/1380e0728e6ebfe06ee9ec7261382fbcfe948f9c))





# [0.22.0](https://github.com/neopostmodern/structure/compare/v0.21.0...v0.22.0) (2022-12-13)


### Bug Fixes

* **client:** completely close app even on macOS when window is closed, workaround for [#182](https://github.com/neopostmodern/structure/issues/182) ([28c3256](https://github.com/neopostmodern/structure/commit/28c32562008f962fe87528372457eaf733fe4607))
* **client:** fetch notes on tag when untagging, updates cache ([7967881](https://github.com/neopostmodern/structure/commit/79678811245ab92625d36286b2ddb72d64f94b8d))
* **client:** workaround to fit notes menu in a single line on even smaller displays ([8673f05](https://github.com/neopostmodern/structure/commit/8673f057988ccf0906ac9143d462a21046ba9040))
* ensure migrations pass on a new/clean database ([f24cab4](https://github.com/neopostmodern/structure/commit/f24cab4c42a036a302929de7050deb5a794da60c))
* include a smaller icon for macOS, fixes [#132](https://github.com/neopostmodern/structure/issues/132) ([62551d0](https://github.com/neopostmodern/structure/commit/62551d0fc3cbf17768f04cf379ef0a74dcd975c7))
* prevent crash on accounts with no notes or tags ([8865d8d](https://github.com/neopostmodern/structure/commit/8865d8dafb723650cb728ecff28b6b80870969bd))


### Features

* add browser-compatible hotkeys/keyboard shortcuts, remove refresh shortcut ([68b56d0](https://github.com/neopostmodern/structure/commit/68b56d0fba1539fd1054761ca3668845b281c6dd))
* **client:** compact notes page menu on mobile ([535e7e9](https://github.com/neopostmodern/structure/commit/535e7e99a5f00db11f8d07b56c7076e5057c4bbc))
* **client:** option to change 'sort by', closes [#125](https://github.com/neopostmodern/structure/issues/125) ([dcecb4e](https://github.com/neopostmodern/structure/commit/dcecb4ebe82ffc91b70f8405e95be83e15397cb3))
* **client:** secondary sort tags by usage ([09f0e7c](https://github.com/neopostmodern/structure/commit/09f0e7c012a8d859b419f84da6f35dc33dcffb8c))
* delete tags, closes [#136](https://github.com/neopostmodern/structure/issues/136) ([0e78333](https://github.com/neopostmodern/structure/commit/0e78333e5e3fbe4415b4ec537eb86bf244777578))
* display nicer pages when there is no content to show, closes [#147](https://github.com/neopostmodern/structure/issues/147) ([39c5e79](https://github.com/neopostmodern/structure/commit/39c5e79e43e7173448a25cd77d8cf0d34c77c966))
* new logo, closes [#46](https://github.com/neopostmodern/structure/issues/46) ([a752f6b](https://github.com/neopostmodern/structure/commit/a752f6b04ed0a4ffb815a83a8f287125781c62d3))
* proper error handling when single entities are not found ([2e613ba](https://github.com/neopostmodern/structure/commit/2e613ba697d5557de01072a0775813f5f24fadc5))
* replace custom tag search with [@mui](https://github.com/mui)'s autocomplete, closes [#141](https://github.com/neopostmodern/structure/issues/141) ([166bf32](https://github.com/neopostmodern/structure/commit/166bf327cb055834bf400e6caa2f9f6110ea2847))
* rudimentary importer ([f8c25fb](https://github.com/neopostmodern/structure/commit/f8c25fbe849e55afc11c2ab5ef0c369e932a36fd))
* **server:** log apollo errors on server ([8cd7bf1](https://github.com/neopostmodern/structure/commit/8cd7bf104f088c6b5a18e05bc89c7a2b17800ec9))
* sort tags with `match-sorter` ([7cdad45](https://github.com/neopostmodern/structure/commit/7cdad456f55c2ea35d33d28d318eabc01c37fb93))
* user data-export self-service, closes [#47](https://github.com/neopostmodern/structure/issues/47) ([7f1ed24](https://github.com/neopostmodern/structure/commit/7f1ed242d889271887e72ea212e68f9dca3240aa))



# [0.21.0](https://github.com/neopostmodern/structure/compare/v0.20.2...v0.21.0) (2022-09-03)


### Bug Fixes

* **client:** add migration to new backend URL for electron app ([009831e](https://github.com/neopostmodern/structure/commit/009831e20740fe8e955a4a92810ea0ff06cb59d8))
* **client:** base cache reconciliation in `useEntitiesUpdatedSince` on received entity ([119c00f](https://github.com/neopostmodern/structure/commit/119c00f2a1aa35a19eec59a153baa926db3632eb))
* **client:** correct checklist rendering in markdown, fixes [#165](https://github.com/neopostmodern/structure/issues/165) ([5ab4775](https://github.com/neopostmodern/structure/commit/5ab47752d599b8862ae93eec048221de2988f10b))
* **client:** correct merging of incoming newly created notes and tags, fixes [#170](https://github.com/neopostmodern/structure/issues/170) ([cf3e6e9](https://github.com/neopostmodern/structure/commit/cf3e6e9dbbe83ab5291fd2150eecb489c7885077))
* **client:** disable sandboxing for preload script ([78c6e72](https://github.com/neopostmodern/structure/commit/78c6e72272d704faf8bf1a2634be3b29a6c7d7f9))
* **client:** fetch `updatedAt` on note when adding tag, fixes [#164](https://github.com/neopostmodern/structure/issues/164) ([c39fc4a](https://github.com/neopostmodern/structure/commit/c39fc4a75d533a80e7a12d4dccab1df7e7f37fc1))
* **client:** fetch entire tag fragment on added tags, fixes [#161](https://github.com/neopostmodern/structure/issues/161) ([f4e885e](https://github.com/neopostmodern/structure/commit/f4e885e8ec398c4d81dba0ac8d3df05f1e00fdbe))
* **client:** include 512px icon in web build ([67a8fbb](https://github.com/neopostmodern/structure/commit/67a8fbbdf23047f5831adbca2f6b3243beec9ecd))
* **client:** re-allow &lt;u> tag, fixes [#167](https://github.com/neopostmodern/structure/issues/167) ([5d1a405](https://github.com/neopostmodern/structure/commit/5d1a4056c2fb73f886039bc8d55288d211ae6cb5))
* **config:** correct config entry key ([f67ad7d](https://github.com/neopostmodern/structure/commit/f67ad7d65262d864efd1c837472095640ea9632c))
* **server:** read config with arrays as field values for deploy ([7b2796c](https://github.com/neopostmodern/structure/commit/7b2796c977420d9540b726d9ceb0b8beb0e99728))
* **server:** trim title suggestions, fixes [#162](https://github.com/neopostmodern/structure/issues/162) ([a8a6402](https://github.com/neopostmodern/structure/commit/a8a6402a4c590fcc0b0e3061e1c20b24fef03af2))


### Features

* add links and text by sharing to PWA, closes [#57](https://github.com/neopostmodern/structure/issues/57) ([54e03e6](https://github.com/neopostmodern/structure/commit/54e03e6fc41802fc770e6b97c6d64287920802bc))
* add links and text by sharing to PWA, closes [#57](https://github.com/neopostmodern/structure/issues/57) ([d07c2ab](https://github.com/neopostmodern/structure/commit/d07c2ab306906af8e1a0474c7ed9c596bcbbb22b))
* redesign add note page clipboard & url input, closes [#171](https://github.com/neopostmodern/structure/issues/171) ([3f43e8d](https://github.com/neopostmodern/structure/commit/3f43e8dba9763bdeeb8ccda27d5c2396950d9da2))



## [0.20.2](https://github.com/neopostmodern/structure/compare/v0.20.1...v0.20.2) (2022-08-12)


### Bug Fixes

* **client:** adapt to new media query structure in MUI theme object ([f6b8ba7](https://github.com/neopostmodern/structure/commit/f6b8ba76a6c148176c08d89f6d78405c85da8eaf))
* **client:** always close notes list action menu after any action, closes [#149](https://github.com/neopostmodern/structure/issues/149) ([2ef6ccf](https://github.com/neopostmodern/structure/commit/2ef6ccf3c362a88846d77e9ee868b9e17b0c5618))
* **client:** ensure spinner displays properly under load, fixes [#144](https://github.com/neopostmodern/structure/issues/144) ([43c882e](https://github.com/neopostmodern/structure/commit/43c882e8559e0dbb68eef060da4cb2d40078d495))
* **client:** fit apollo error message on small screen ([e7675aa](https://github.com/neopostmodern/structure/commit/e7675aa9e72cdcb11b944c2cac23283a6577e9cd))
* **client:** forgiving access to `navigator.permissions` API, closes [#153](https://github.com/neopostmodern/structure/issues/153) ([a9fb8b9](https://github.com/neopostmodern/structure/commit/a9fb8b92d75ec7bce390b4d68ae312873c647ae6))
* **client:** only used cached profile data in ComplexLayout (maybe related to [#138](https://github.com/neopostmodern/structure/issues/138)) ([e98568e](https://github.com/neopostmodern/structure/commit/e98568e3bd2dc1a5ae473657a89f440e024c18d1))
* **client:** prevent double submission and display of notes added through bookmarklet to web or desktop, closes [#148](https://github.com/neopostmodern/structure/issues/148) ([9723ae2](https://github.com/neopostmodern/structure/commit/9723ae2e5be3353d061e59ec7bf304421f227a9b))
* **client:** show errors in UI on `TagPage` ([a846b33](https://github.com/neopostmodern/structure/commit/a846b33ba5f09e4dd920f69eb597cb5a2e07a112))
* **client:** sync all forms when receiving prop (e.g. after mutation), fixes [#160](https://github.com/neopostmodern/structure/issues/160) ([19fb53c](https://github.com/neopostmodern/structure/commit/19fb53c8293beb9b1c6d710a71932706ee1e5d6c))
* **client:** use default export of package.json ([689b4c4](https://github.com/neopostmodern/structure/commit/689b4c487f8e34fa0be81e37c1b43d4442e22190))
* use cached tags in AddTagForm ([95531e3](https://github.com/neopostmodern/structure/commit/95531e3bcc42a69a11e914283e59f7b3c9b2eb9e))


### Features

* **client:** `useIsOffline` hook with reactive network status ([ba3ba27](https://github.com/neopostmodern/structure/commit/ba3ba277b78fde3298ee24793f4ccc7bf7160a31))
* **client:** add advanced setting to change network mode ([88d5936](https://github.com/neopostmodern/structure/commit/88d5936521d0ecb77c3a4a158f51ab4a7b13abe8))
* **client:** add error color to 'Save failed!' warning ([88d6d73](https://github.com/neopostmodern/structure/commit/88d6d7391f299251c809ac3500a4d3616acbdb88))
* **client:** adjust theme color with dark-mode preference, closes [#139](https://github.com/neopostmodern/structure/issues/139) ([12e7930](https://github.com/neopostmodern/structure/commit/12e79302f82408c4bbf668091cb01e0e26d6f8b8))
* **client:** advanced settings section, ability to clear cache ([c1e2b7e](https://github.com/neopostmodern/structure/commit/c1e2b7ef00072a50e78187c57a3a849a9a0a6561))
* **client:** replace `marked` with `react-markdown`, closes [#142](https://github.com/neopostmodern/structure/issues/142) ([7fe51f7](https://github.com/neopostmodern/structure/commit/7fe51f7c8556a19fbf17b721201177be506f7d43))
* **client:** respect `env(safe-area-inset-bottom)`, closes [#127](https://github.com/neopostmodern/structure/issues/127) ([1964018](https://github.com/neopostmodern/structure/commit/1964018958fe7a81eacecb0e8b9184167274f747))
* only fetch data since last fetch, closes [#122](https://github.com/neopostmodern/structure/issues/122) ([882fa52](https://github.com/neopostmodern/structure/commit/882fa52244956c2c908191390079a30d5b0e9e15)), closes [#159](https://github.com/neopostmodern/structure/issues/159)
* reject saves when updatedAt is stale, closes [#155](https://github.com/neopostmodern/structure/issues/155) ([b1cd50c](https://github.com/neopostmodern/structure/commit/b1cd50c2e6e08317abeab0d6005541c7137954ba))



## [0.20.1](https://github.com/neopostmodern/structure/compare/v0.20.0...v0.20.1) (2022-05-13)


### Bug Fixes

* add `@babel/plugin-transform-runtime` ([b53c3ee](https://github.com/neopostmodern/structure/commit/b53c3ee282fe6a87b1f55d97215de60b5b09dc08))
* add submit event handlers to link, text, tag forms ([75c2f98](https://github.com/neopostmodern/structure/commit/75c2f98f8b0579a54c2526f387d9b68b69bf9212))
* **client:** adjust network indicator state logic ([ed6c827](https://github.com/neopostmodern/structure/commit/ed6c8278615f8f60184e4068d9a2b2fe5e2bf783)), closes [#135](https://github.com/neopostmodern/structure/issues/135)
* **client:** also set field dirty when using paste button for link entry ([d91e451](https://github.com/neopostmodern/structure/commit/d91e451f928c52a0d96adaf0ff6d1f65e4915bd1)), closes [#133](https://github.com/neopostmodern/structure/issues/133)
* **client:** disable browser autocomplete on new note and tag inputs ([dd7af00](https://github.com/neopostmodern/structure/commit/dd7af000089fb7d71d76856d018b67bcd7691e04)), closes [#145](https://github.com/neopostmodern/structure/issues/145)
* **client:** only explicitly refetch profile query just after logging in state finishes ([79a966a](https://github.com/neopostmodern/structure/commit/79a966ae6a312f5a04b2e8a549039d8cf390a77a))
* **client:** prevent crash when invalid or empty URL is entered on link page ([ae7e174](https://github.com/neopostmodern/structure/commit/ae7e1746791a896f5bea20199626e72a715206d5)), closes [#130](https://github.com/neopostmodern/structure/issues/130)
* **client:** set field to dirty when (auto-)pasting link ([b78eb6c](https://github.com/neopostmodern/structure/commit/b78eb6c8bfc96fadbda556e24c00a65004d35749)), closes [#133](https://github.com/neopostmodern/structure/issues/133)
* handle nested form submission manually in `InlineTagForm` ([599a111](https://github.com/neopostmodern/structure/commit/599a111730f63437a497a65bc3aac13fa33df34c)), closes [#137](https://github.com/neopostmodern/structure/issues/137)


### Features

* directly create text note with title from add note page ([74c5bc5](https://github.com/neopostmodern/structure/commit/74c5bc57b0e2404a9f8062572fdc68fda7c4435e)), closes [#134](https://github.com/neopostmodern/structure/issues/134)
* **server:** update mongoose to v6 ([07aec25](https://github.com/neopostmodern/structure/commit/07aec25a7af6cf917317acf41e5be78233fcce1c))


### Performance Improvements

* **client:** performance optimization with `React.memo` on `Tags` and `RenderedMarkdown` ([f83d02b](https://github.com/neopostmodern/structure/commit/f83d02b0dbf28ad2e29586fe4d8dc03e3a6c0480))



# [0.20.0](https://github.com/neopostmodern/structure/compare/v0.20.0-7...v0.20.0) (2022-05-10)


### Bug Fixes

* add missing key in Tags component ([8c4ad69](https://github.com/neopostmodern/structure/commit/8c4ad690f9fe3f6437a9abb1811e09cc382c6574))
* **client:** clear apollo store and cache on logout ([567e279](https://github.com/neopostmodern/structure/commit/567e279e3cb380a9d195e1bd22db7fd97b9d8353))
* **client:** correct focus behavior of markdown textarea ([d494aef](https://github.com/neopostmodern/structure/commit/d494aefb27918f76738664794a5fcd333fa1d3f5))
* **client:** correctly display error information in ErrorBoundary ([090ca5c](https://github.com/neopostmodern/structure/commit/090ca5c9e8f7ebdc080df576ef5e92a544804bc4))
* **client:** manually handle offline query cache misses ([83a3577](https://github.com/neopostmodern/structure/commit/83a357797de197d336d49d89faf6d983d3d4aef9))
* **client:** only center main content if no wide layout is set ([fa46ef7](https://github.com/neopostmodern/structure/commit/fa46ef73c13a69b9402ef7c0586f9101a5b0454c)), closes [#124](https://github.com/neopostmodern/structure/issues/124)
* **client:** only expect title suggestions after the query has been called ([1d8f6f4](https://github.com/neopostmodern/structure/commit/1d8f6f4dbc62ef7c7f0d5beaa7b9b99f1e542b17))
* **client:** prevent full error message in NetworkError from overflowing ([693d67a](https://github.com/neopostmodern/structure/commit/693d67ac47aa57109a19cdb05db3638ca11654e7))
* **client:** prevent long tags from overflowing ([4d52a77](https://github.com/neopostmodern/structure/commit/4d52a7785c94dc9106cbec658a595fc510eab028))
* **client:** restore changing markdown from edit to view mode via tabs ([0446434](https://github.com/neopostmodern/structure/commit/0446434c818af979db0c31386908d673b5cfef87)), closes [#119](https://github.com/neopostmodern/structure/issues/119)
* **client:** stack loading indicator and message in ComplexLayout ([aa838cb](https://github.com/neopostmodern/structure/commit/aa838cb903f908afe983440bd25baf371f1c42a7))
* display version marks when logged in, only reload in browser ([d9788cd](https://github.com/neopostmodern/structure/commit/d9788cdc6c78e758630cc3197216559ad84bc743))
* explicit import of JSON files ([cca5b5d](https://github.com/neopostmodern/structure/commit/cca5b5d55c0ad2d784e31f9d0c6d1ac8d6319b4d))
* **server:** actually migrate down (instead of up) in migrateDown method ([859ef25](https://github.com/neopostmodern/structure/commit/859ef252b606af4a5ebff4759b0aca7cba4742de))
* use vertical-horizontal menu for settings page ([2e47138](https://github.com/neopostmodern/structure/commit/2e47138e411cb8599a682ffccfa0d0809ebaa343))


### Features

* **client:** add submit, paste button to add link form ([6cfb86e](https://github.com/neopostmodern/structure/commit/6cfb86e2410e34d3c371b5379e8ec7c066f0bc9a))
* **client:** adjust history interactions after adding note, show loading indicator ([2bb7bc6](https://github.com/neopostmodern/structure/commit/2bb7bc6fd651fa4a30d2bf110ae7c959216bf255))
* **client:** always show tag color input text, adapt text color ([047f203](https://github.com/neopostmodern/structure/commit/047f2035853e908cb905ce4b98bfe3b5becf7a99))
* **client:** archive button on link/text page ([0f41a75](https://github.com/neopostmodern/structure/commit/0f41a757029685ff2031dda7e57c369828553339))
* **client:** context menu for tags ([5b9c823](https://github.com/neopostmodern/structure/commit/5b9c8238c9b2d1b07eb32a34f39e4369f8570ac8))
* **client:** create expanded list note layout ([e6860d8](https://github.com/neopostmodern/structure/commit/e6860d80593ef84e9328ffdd295247f428f1348f))
* **client:** debounce search/filter updates ([a7a4c0f](https://github.com/neopostmodern/structure/commit/a7a4c0f36d44bd918ba94632882022f3d7a40a79)), closes [#123](https://github.com/neopostmodern/structure/issues/123)
* **client:** enable overlay scrollbars for electron app, closes [#112](https://github.com/neopostmodern/structure/issues/112) ([8e18a08](https://github.com/neopostmodern/structure/commit/8e18a086c8ca6657ea81ce66bebec5d16d50d683))
* **client:** explicit data state management for query ([d2fda5f](https://github.com/neopostmodern/structure/commit/d2fda5fb568759fbe1fac3dc0063d93a12f094a4))
* **client:** extract note batch editing into specialized component ([6a72ab1](https://github.com/neopostmodern/structure/commit/6a72ab147134e4659f22199a106fd57818584806))
* **client:** improve placeholders for partial error display ([6467a0b](https://github.com/neopostmodern/structure/commit/6467a0b52a2c78e5ed1bcf2e31c6694c9d94bc49))
* **client:** many performance improvements ([8894d7f](https://github.com/neopostmodern/structure/commit/8894d7f61674fe54527fd50662739644c37cdba5))
* **client:** minor design improvements ([75ce353](https://github.com/neopostmodern/structure/commit/75ce353b23b5d8d14477c4e65d0b2159ae72baf8))
* **client:** minor improvements in tag column layout ([b31c671](https://github.com/neopostmodern/structure/commit/b31c6712990a8ed676cdbb8805289a372f751a95)), closes [#117](https://github.com/neopostmodern/structure/issues/117)
* **client:** misc design & minor code fixes ([a1f71f8](https://github.com/neopostmodern/structure/commit/a1f71f8d6d8e774b9b9f79499e562348653f1b47))
* **client:** re-enable PWA (service worker, webmanifest) ([69588f5](https://github.com/neopostmodern/structure/commit/69588f574e9213a80e5b8a57d355e869f12f7190)), closes [#124](https://github.com/neopostmodern/structure/issues/124)
* **client:** share URL option in notes list and link page ([b363bd5](https://github.com/neopostmodern/structure/commit/b363bd54ec4b6b634669c23a2f4739eb69096026))
* **client:** use `useDataState` and `gracefulNetworkPolicy` on all pages ([5920224](https://github.com/neopostmodern/structure/commit/5920224b7471c7f7ba4b0c93f2c34d551da3c104))
* create NetworkOperationsIndicator and use throughout, update ComplexLayout to create space for indicator ([4575efa](https://github.com/neopostmodern/structure/commit/4575efa5d8d056cfc7301242dad296bc6f99bc39)), closes [#115](https://github.com/neopostmodern/structure/issues/115)
* make read only state of backend URL explicit in web version ([5da9e63](https://github.com/neopostmodern/structure/commit/5da9e63c94362dce03fe1d35d43343802b4e0546))
* move tags below title & url on link / text page, closes [#113](https://github.com/neopostmodern/structure/issues/113) ([c3dc4cf](https://github.com/neopostmodern/structure/commit/c3dc4cf3ea3bc5a7552c7426e9905385941e22fd))
* move title suggestion generation server-side, closes [#114](https://github.com/neopostmodern/structure/issues/114) ([84d870c](https://github.com/neopostmodern/structure/commit/84d870c51cd3e48e91a608d48d1811d1bda18f5c))
* responsive navigation design ([6f44956](https://github.com/neopostmodern/structure/commit/6f449562cf4a2d9c568ea95c55347c0aa07edd71))
* reworked note deletion ([9074365](https://github.com/neopostmodern/structure/commit/90743657ec303afaa414a81c8ca13b76f1967124))
* **server:** add updatedAt field to all collections and createdAt where missing ([1e5c647](https://github.com/neopostmodern/structure/commit/1e5c647f67856ff4e5a83e3997753f3dd68bb054)), closes [#116](https://github.com/neopostmodern/structure/issues/116) [#121](https://github.com/neopostmodern/structure/issues/121)
* **server:** expose createdAt and updatedAt fields everywhere ([51a2811](https://github.com/neopostmodern/structure/commit/51a281115ba6bbc04da56c119b4b61cd9992318c))
* show stack in ErrorBoundary, move buttons to top ([1685a69](https://github.com/neopostmodern/structure/commit/1685a69e0d8c273b39fbdb2a685288efa759fcd7))
* switch to semver for versions query, bump legacy server API version ([fbd284e](https://github.com/neopostmodern/structure/commit/fbd284ea96a600fe18aa174d4a6b4a1b14a6f257))



# [0.20.0-7](https://github.com/neopostmodern/structure/compare/v0.20.0-6...v0.20.0-7) (2022-04-03)


### Bug Fixes

* **client:** adjust overflow and spacing of note title in list ([d42affc](https://github.com/neopostmodern/structure/commit/d42affcdc6c5506311f9ce868c9116a16dcdd6c3))
* **client:** force network-fetch after cache-read on tag page, closes [#109](https://github.com/neopostmodern/structure/issues/109) ([89df6fc](https://github.com/neopostmodern/structure/commit/89df6fc9a916cb5b48aef582cad566a9021dbbb1))
* **client:** force updating values of text form on prop change, closes [#108](https://github.com/neopostmodern/structure/issues/108) ([449a226](https://github.com/neopostmodern/structure/commit/449a2268564862958cc20bdde77b62086dd1c637))
* **client:** typo in text note deletion cache update, closes [#106](https://github.com/neopostmodern/structure/issues/106) ([70f2ac0](https://github.com/neopostmodern/structure/commit/70f2ac04ccb24065444ef4e9e2b4f069c60ba0f3))
* make return types non-optional in schema ([4736a5d](https://github.com/neopostmodern/structure/commit/4736a5da6480b27e57ba8011d439dc6a9986942f))


### Features

* **client:** add tooltips for common buttons and links, closes [#107](https://github.com/neopostmodern/structure/issues/107) ([bebecbd](https://github.com/neopostmodern/structure/commit/bebecbd2f3ecda92626ed788e0082561bd39708c))
* **client:** archive button inside action menu in note list ([5198cf4](https://github.com/neopostmodern/structure/commit/5198cf4a23367ec4db6cfab77812eac4a005da10))
* **client:** decrease font size of TitleLink on mobile ([120ade9](https://github.com/neopostmodern/structure/commit/120ade97fb09341868910effed68ec9d82a6a45b))
* **client:** improved focusing of edit note text, closes [#110](https://github.com/neopostmodern/structure/issues/110) ([d88a5a6](https://github.com/neopostmodern/structure/commit/d88a5a69390e7dc91c3d52f67c1a9c29b68dac31))



# [0.20.0-6](https://github.com/neopostmodern/structure/compare/v0.20.0-5...v0.20.0-6) (2022-03-28)


### Bug Fixes

* don't share electron-store between dev, staging and production ([d7941c1](https://github.com/neopostmodern/structure/commit/d7941c1564d26e64b6c5a1757c5575a81fc894b8))
* restore installability on Ubuntu ([88ab27a](https://github.com/neopostmodern/structure/commit/88ab27ade4f66a476ce4ed767c12d5eee9199de6))
* use IPC and navigation action for handling desktop bookmarklet in app ([e3c8be5](https://github.com/neopostmodern/structure/commit/e3c8be50af0f498c9f6a7d55331c2910cc5ff70f))


### Features

* **client:** add error boundary and global error handler, closes [#84](https://github.com/neopostmodern/structure/issues/84) ([f43b34e](https://github.com/neopostmodern/structure/commit/f43b34e7a8db37dd28c6ea65fa064beb0642a476))
* **client:** update view/edit not text tools ([52a2737](https://github.com/neopostmodern/structure/commit/52a27370c307aa4cf1c689c192193ae38f6115da))
* confirmation dialog before deleting note ([eda3d11](https://github.com/neopostmodern/structure/commit/eda3d110b81a6f5582c0d688a73f374d310b6135))
* improved spacing in narrow layout ([545f66a](https://github.com/neopostmodern/structure/commit/545f66a79dc60a9ea96300de8c52edfa89546886))
* minimal styles for rendered markdown ([ec4d795](https://github.com/neopostmodern/structure/commit/ec4d795a571210d38531f9bbde24ee9f4f32510d))
* update cache when deleting text note ([6325b22](https://github.com/neopostmodern/structure/commit/6325b2220144ccb4baf5b425adadaaf226f8f05a))



# [0.20.0-5](https://github.com/neopostmodern/structure/compare/v0.20.0-4...v0.20.0-5) (2022-02-12)


### Bug Fixes

* **client:** wrap elements in Navigation ([f4df289](https://github.com/neopostmodern/structure/commit/f4df289bde6d8c2e798682e62931472bd9aa1ff2))



# [0.20.0-4](https://github.com/neopostmodern/structure/compare/v0.20.0-3...v0.20.0-4) (2022-02-11)


### Bug Fixes

* (wide) styles for tags page ([02b065c](https://github.com/neopostmodern/structure/commit/02b065ce608f0c1ac5a99aec81b4d84373c89cb5))
* add [@mui](https://github.com/mui) / styled resolver to dll config too ([00a6142](https://github.com/neopostmodern/structure/commit/00a614274c6eb638b1602960e6aa8374b0bf6476))
* add text to cache on add ([73beb1e](https://github.com/neopostmodern/structure/commit/73beb1e18fc6a6d585cd94ae96353602107df8d6))
* consistent margins for overall layout across devices ([e89b55a](https://github.com/neopostmodern/structure/commit/e89b55ab5ce72345c8f2ba55ed4f4ed7f9a8c045))
* don't render layout twice while loading user ([c363a5d](https://github.com/neopostmodern/structure/commit/c363a5ddcc1229505fafd9f11918310045090dbf))
* don't show loading indicator on ComplexLayout if user data is cached ([b930f86](https://github.com/neopostmodern/structure/commit/b930f867658a9ebaa152bb9ff26da31bf2b58313))
* ensure data can be accessed in AuthWrapper ([30b4483](https://github.com/neopostmodern/structure/commit/30b448383e660101cfb50ebf9316bd70278dd07c))
* ensure excluding media queries don't overlap ([73d5e19](https://github.com/neopostmodern/structure/commit/73d5e19b24cf17394629bf258ba64414fb3bc4ba))
* stabilize layout when hovering over notes list ([80b6b50](https://github.com/neopostmodern/structure/commit/80b6b50c96f8f93dcdc4e88fc1518601ffc19550))
* use gap for tag containers ([5dd7a58](https://github.com/neopostmodern/structure/commit/5dd7a58c5c589d740e96990f19de7ccf714bd3e3))


### Features

* decrease tag size (except on note pages) ([54a29f6](https://github.com/neopostmodern/structure/commit/54a29f6635d168feb64150011ee84bedf3abdfea))
* Navigation component ([28d3130](https://github.com/neopostmodern/structure/commit/28d31309838dcc3ed0f6f7d610df94c5c499910f))
* replace custom tag styles with [@mui](https://github.com/mui)'s Chip ([d021dae](https://github.com/neopostmodern/structure/commit/d021dae06c0c2707a03dc1a99160c15515ce5711))
* replace most remaining styled.button with [@mui](https://github.com/mui)'s Button ([332864b](https://github.com/neopostmodern/structure/commit/332864b75847603d6528592b8906a78ad407baf9))
* use NetworkError component with refetch throughout ([07fa021](https://github.com/neopostmodern/structure/commit/07fa021ddcf60fa7a604a733722ef3a17b7d8ed0))


### Performance Improvements

* use memo and disable pointer events on tags page ([49db413](https://github.com/neopostmodern/structure/commit/49db4138c577c9d7a7b7c87682b1ec49324d1417))



# [0.20.0-3](https://github.com/neopostmodern/structure/compare/v0.20.0-2...v0.20.0-3) (2022-02-06)


### Bug Fixes

* don't unmount text page when re-loading data ([ae5174e](https://github.com/neopostmodern/structure/commit/ae5174e08f5c6b8d50eebad7fe9770b918bdd7a1))


### Features

* add [@mui](https://github.com/mui) packages ([095dd74](https://github.com/neopostmodern/structure/commit/095dd74a5cfaf7964fd8cb23b7aa38b92338f71e))
* dark-mode ([49196f6](https://github.com/neopostmodern/structure/commit/49196f6d91b8084f03cc6f711c4950747c4a0de3))
* increase number of initially displayed notes ([5da2ddd](https://github.com/neopostmodern/structure/commit/5da2ddd5d50e22c11efdd92d77c331344e375a40))
* migrate remaining pages to ComplexLayout ([d141ca2](https://github.com/neopostmodern/structure/commit/d141ca2b4456464092fa9056b1a5b520eee28e58))
* proper loading indicators for pages ([2ce40a9](https://github.com/neopostmodern/structure/commit/2ce40a9124fe9c05c7de9fcfabdd9d8d020a07f4))
* replace legacy TextButton and InlineButton with [@mui](https://github.com/mui) buttons ([1d3b72e](https://github.com/neopostmodern/structure/commit/1d3b72e9962b53a16f147cdc09aaf1aca5aa1cb3))
* use [@mui](https://github.com/mui) buttons in menus ([aa70a27](https://github.com/neopostmodern/structure/commit/aa70a27116c8bee8f68002ceedc9d4e98b970fa1))



# [0.20.0-2](https://github.com/neopostmodern/structure/compare/v0.20.0-1...v0.20.0-2) (2022-02-04)


### Bug Fixes

* don't render layout twice with AuthWrapper ([dc8bd99](https://github.com/neopostmodern/structure/commit/dc8bd99796899436a15574b8fdfa1137a02bc9e8))
* handle network errors in user settings section ([442bc43](https://github.com/neopostmodern/structure/commit/442bc435a614f7f57c61d66c0dd8e01038639609))
* **server:** cross-origin cookies for modern browsers ([590adf6](https://github.com/neopostmodern/structure/commit/590adf6f36aad266236844c1e432f7d718f8a072))


### Features

* allow pages to render while offline ([ccc01bb](https://github.com/neopostmodern/structure/commit/ccc01bb080bea945b341bc9728c9bee5d7fde090))
* **backup:** warn if ENV variables not set in backup script ([0f35f33](https://github.com/neopostmodern/structure/commit/0f35f33fe43100d4944c43b06f17dcd8363b82b8))
* don't show button to add tag when offline ([5ec27af](https://github.com/neopostmodern/structure/commit/5ec27afe461aaf1681b466418ca082baff07591b))
* logout functionality for electron app ([a3b71f3](https://github.com/neopostmodern/structure/commit/a3b71f3cf508e52f77574c386b4cec37cf861244))
* show cached notes while offline ([84e3765](https://github.com/neopostmodern/structure/commit/84e3765f769a772ff31c4d24124f7363ab5cd2fc))
* use NetworkError component in AuthWrapper ([b846f79](https://github.com/neopostmodern/structure/commit/b846f79d42b4ab888620b3bbcbd51953cd2595e3))



# [0.20.0-1](https://github.com/neopostmodern/structure/compare/v0.20.0-0...v0.20.0-1) (2022-02-02)


### Bug Fixes

* AuthWrapper for ComplexLayout ([39de439](https://github.com/neopostmodern/structure/commit/39de4392f452b37147252b9d90d1ac7dc64cb22f))
* production store ([8207483](https://github.com/neopostmodern/structure/commit/8207483956b097ae1f344e1c9453e994f393b07d))


### Features

* complex layout ([04d6bdb](https://github.com/neopostmodern/structure/commit/04d6bdb67dce7572dc9259935a7f87296cd676cd))
* extract user settings section from settings page ([53d3678](https://github.com/neopostmodern/structure/commit/53d36787c684049937f401d32550a2177f84787f))



# 0.20.0-0 (2022-02-02)



# [](https://github.com/neopostmodern/structure/compare/v0.22.0...v) (2022-12-16)


### Bug Fixes

* **client:** don't treat key presses on textarea as shortcuts ([1380e07](https://github.com/neopostmodern/structure/commit/1380e0728e6ebfe06ee9ec7261382fbcfe948f9c))



# [](https://github.com/neopostmodern/structure/compare/v0.22.0...v) (2022-12-16)


### Bug Fixes

* **client:** don't treat key presses on textarea as shortcuts ([1380e07](https://github.com/neopostmodern/structure/commit/1380e0728e6ebfe06ee9ec7261382fbcfe948f9c))
