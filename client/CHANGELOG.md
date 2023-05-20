# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.23.1](https://github.com/neopostmodern/structure/compare/v0.23.0...v0.23.1) (2023-05-20)


### Bug Fixes

* **client:** actually calculate notes count for tag sorting ([71a35b6](https://github.com/neopostmodern/structure/commit/71a35b67a5bd43fa7ef7a26282a180c0d7734577))
* **client:** actually run client-side migrations, fixes [#215](https://github.com/neopostmodern/structure/issues/215) ([3f15603](https://github.com/neopostmodern/structure/commit/3f156036d4d8b51fad4f88cd4f9aeef6a95fe5f3))
* **client:** add new tag reference directly to query cache, fixes [#221](https://github.com/neopostmodern/structure/issues/221) ([d6a8538](https://github.com/neopostmodern/structure/commit/d6a85389e3703b87926b9ca3dbcfa50c0f0d872f))
* **client:** pass autocomplete InputProps to input on LinkNameField, fixes [#216](https://github.com/neopostmodern/structure/issues/216) ([a98751a](https://github.com/neopostmodern/structure/commit/a98751ad3f424c2fd6d73ae27a3c3c66edfac298))
* **client:** reduce pollution of cache by ephemeral queries ([3c08433](https://github.com/neopostmodern/structure/commit/3c084332ffd100435458713c5cc181803e79f7e4))
* **client:** show actual tag name in color picker, fixes [#217](https://github.com/neopostmodern/structure/issues/217) ([c21b71e](https://github.com/neopostmodern/structure/commit/c21b71e535fa3f3cfef7d4de008c8ac60754c5bb))
* **client:** show add tag form input while tags load, fixes [#220](https://github.com/neopostmodern/structure/issues/220) ([8990198](https://github.com/neopostmodern/structure/commit/8990198033702e72e8f01ac4ec43e5591df6b4d5))
* **client:** text ellipsis for note menu buttons, fixes [#218](https://github.com/neopostmodern/structure/issues/218) ([5fe5e18](https://github.com/neopostmodern/structure/commit/5fe5e1823b8bc79a9c028ccfbf2f3a2a866b2983))
* sort notes by createdAt for server cache stability ([30460cf](https://github.com/neopostmodern/structure/commit/30460cf96252be57a728e96e8ee48063cdfdea31))





# [0.23.0](https://github.com/neopostmodern/structure/compare/v0.22.1...v0.23.0) (2023-05-18)


### Bug Fixes

* always allow users to unshare another user's tag from themselves ([490c1c0](https://github.com/neopostmodern/structure/commit/490c1c04f8c9e740fce496dc547a69ea5dd23fe6))
* **client:** accept quick submit shortcut from within other input fields (make "global") ([cc0c0e9](https://github.com/neopostmodern/structure/commit/cc0c0e9d8ec8b90b385890bb9a7656c4cca9376e))
* **client:** check `sortBy` when reading extended filtered notes cache ([bc795ee](https://github.com/neopostmodern/structure/commit/bc795ee567074f0579538b281c558a55c81a1de6))
* **client:** clear localStorage on logout ([b549b1f](https://github.com/neopostmodern/structure/commit/b549b1f63fe9830ad8980f7daaceb58edfc629ac))
* **client:** correct select-all logic for notes list ([c5e69d2](https://github.com/neopostmodern/structure/commit/c5e69d2c6d6e6194ba2faf2ff5b3d7f75b9744d9))
* **client:** don't treat everything with a colon as a URL, fixes [#208](https://github.com/neopostmodern/structure/issues/208) ([6b3f589](https://github.com/neopostmodern/structure/commit/6b3f5895b0a0432992a4e4633bde40bc591e8daa))
* **client:** ensure `ErrorSnackbar` is visible ([d385bae](https://github.com/neopostmodern/structure/commit/d385bae5623547c0577cfccdb8248148893f1b5d))
* **client:** ensure light text color in light-mode shortcuts ([76ab641](https://github.com/neopostmodern/structure/commit/76ab6417e71cf97b33e38b7f4affbb421e1b2fa9))
* **client:** ensure proper cache-removal of deleted note ([4cabfb9](https://github.com/neopostmodern/structure/commit/4cabfb90adbbc4a2d11d6ccb5bf5628c178f3d71))
* **client:** ensure tag autocomplete renders on top of other elements ([d2f6071](https://github.com/neopostmodern/structure/commit/d2f6071d2733a6cdcd023535b723422ae1b42298))
* **client:** filter out tags without 'use' permission for add tag form ([1a41e06](https://github.com/neopostmodern/structure/commit/1a41e064bb332838239cadfd09fecea9b74d21a8))
* **client:** focus and shortcut management for `ctrl+tab` ([0d5eb6b](https://github.com/neopostmodern/structure/commit/0d5eb6b4062f314632de44efa499a14e5841fba8))
* **client:** hide internal tags from tags page ([a39d112](https://github.com/neopostmodern/structure/commit/a39d11248860390f5dee2831e1d52184a24559a7))
* **client:** increase space between text notes and secondary actions on mobile, fixes [#211](https://github.com/neopostmodern/structure/issues/211) ([66b1643](https://github.com/neopostmodern/structure/commit/66b1643c217550d2ba857664f3700f715b56abee))
* **client:** prevent visual content jumps ([159aa3d](https://github.com/neopostmodern/structure/commit/159aa3d4b4fa4bdce3316b4f03ce8fb8bc13bf1a))
* **client:** proper read-only form field props and styles ([8b0c4ff](https://github.com/neopostmodern/structure/commit/8b0c4fff9bc7f4be556f2eb53b3ebd1912453353))
* **client:** remove `electron-store` ([87c7c82](https://github.com/neopostmodern/structure/commit/87c7c82649e6d8a9b2c3cad3b27d3eb5989eab3a))
* **client:** remove unshared tag from cached notes ([87df758](https://github.com/neopostmodern/structure/commit/87df758156dd26f9e46634b0c1be79d60c0c224e))
* **client:** run visibility check and note list length expansion also when 5-10 notes are to be displayed, closes [#210](https://github.com/neopostmodern/structure/issues/210) ([023e342](https://github.com/neopostmodern/structure/commit/023e342e7e783b1d73240d389715876e9e806cf8))
* **client:** show errors in UI when deleting tag ([c68a6c0](https://github.com/neopostmodern/structure/commit/c68a6c0d9d5d3b347d77213a6374b05ff1551120))
* **client:** wait for apollo cache to mount react app ([9a30b43](https://github.com/neopostmodern/structure/commit/9a30b4305c6f601001ee55c09afc04e56b964d43))


### Features

* **client:** (re-)add shortcut 'r' to refresh notes ([de5c45d](https://github.com/neopostmodern/structure/commit/de5c45d259be2a6ea8f6924e0874d7143ff89e7b))
* **client:** add web shortcut for last visited notes + show in tooltip ([e3d73ba](https://github.com/neopostmodern/structure/commit/e3d73ba4da55d9ad8124939acf01faafc6bd78f7))
* **client:** color picker for tags, closes [#188](https://github.com/neopostmodern/structure/issues/188) ([0656820](https://github.com/neopostmodern/structure/commit/0656820cd5814b82e01d59ec3b2e14c8da4be2dd))
* **client:** copy URL button and menu item for note, closes [#189](https://github.com/neopostmodern/structure/issues/189) ([a0e1354](https://github.com/neopostmodern/structure/commit/a0e13545c7f15297a677474adac916dff8dd4962))
* **client:** design improvements for tag sharing ([4526c1f](https://github.com/neopostmodern/structure/commit/4526c1ff848927c7472dfad0427bfe8700695674))
* **client:** don't show search tooltip when focused ([8d00531](https://github.com/neopostmodern/structure/commit/8d00531eedf421bc04409602e3e9ed11888e22d0))
* **client:** intersection observer for infinite scroll and decreased initial rendering ([b4d68ac](https://github.com/neopostmodern/structure/commit/b4d68ac1d64d2d4ffa9b28b3ac23842b861b632e))
* **client:** memoize sorted and filtered notes across (un)mounts ([c30b8a5](https://github.com/neopostmodern/structure/commit/c30b8a51c3be590608672672130f47fab7c78b75))
* **client:** more manual cache mappings for apollo ([b9d1dd6](https://github.com/neopostmodern/structure/commit/b9d1dd68d60653fbb1ba750af2d9c1885a20e1c5))
* **client:** more manual cache mappings for apollo ([0a48f7d](https://github.com/neopostmodern/structure/commit/0a48f7d3a028ed3576048080b1b9eb1200f5ec63))
* **client:** only save forms if the value was changed ([76b61bb](https://github.com/neopostmodern/structure/commit/76b61bb31ad9cceceace23f165c258212239b9cc))
* **client:** pass keyboard event to bindShortcut / useShortcut ([4253d2f](https://github.com/neopostmodern/structure/commit/4253d2f4910173272b732b0ee71e6eb9c268dada))
* **client:** persist last visited notes locally across page (re)loads ([0257197](https://github.com/neopostmodern/structure/commit/0257197e0342b96a434054737172b5c64b6407d1))
* **client:** read-only UI for notes without write permissions ([e7cf204](https://github.com/neopostmodern/structure/commit/e7cf204f1a9764eecd8f6eb5e7c0530eb16a880a))
* **client:** replace custom TextField with MUI TextField ([c69932d](https://github.com/neopostmodern/structure/commit/c69932df40d3381c581757e7fc439e101b5f3e41))
* **client:** shortcut for accessing last visited notes, closes [#205](https://github.com/neopostmodern/structure/issues/205) ([760e477](https://github.com/neopostmodern/structure/commit/760e4777c54dbb2695777960220fb79c299a412b))
* **client:** shortcut for adding URL from clipboard, closes [#185](https://github.com/neopostmodern/structure/issues/185) ([83b4223](https://github.com/neopostmodern/structure/commit/83b42230493f3d5f38ab0ea9507135b86ce7108c))
* **client:** shortcut to open first through ninth note in list ([cb3ff54](https://github.com/neopostmodern/structure/commit/cb3ff54540b245dfc9f46dd9502819485dfc5c9e))
* **client:** shortcuts for title suggestions, closes [#206](https://github.com/neopostmodern/structure/issues/206) ([b6003ae](https://github.com/neopostmodern/structure/commit/b6003ae07265849dd225f27712885cee6fbc5fa5))
* **client:** show basic metadata for notes and tags on their page ([3c53b79](https://github.com/neopostmodern/structure/commit/3c53b794879a653ec909c88fe4f2b23d266cfdda))
* **client:** show indicators if tags and notes are shared ([97a0b6c](https://github.com/neopostmodern/structure/commit/97a0b6ca1f0cfe90187a3d6663717f459f6182b6))
* **client:** some note typography refinements, closes [#207](https://github.com/neopostmodern/structure/issues/207) ([f2991df](https://github.com/neopostmodern/structure/commit/f2991dfe1f7e33f6a6c512a6db98b24da78cb65d))
* **client:** tooltips with shortcuts, shortcut utilities ([0b4ff9c](https://github.com/neopostmodern/structure/commit/0b4ff9c323236aa96ed1f36550b7bfad004701b1))
* **client:** use localForage for data persistence ([4a789b5](https://github.com/neopostmodern/structure/commit/4a789b5dac48785de01c284d4bdd2512a8a3879e))
* **client:** visual improvements for (re-)mounting notes page (and everything else potentially) ([90bed39](https://github.com/neopostmodern/structure/commit/90bed39d0f0f318216801608d242df92fee536ea))
* sharing notes by tag with permission system, closes [#49](https://github.com/neopostmodern/structure/issues/49) ([623b764](https://github.com/neopostmodern/structure/commit/623b764818f6034d5349b14f79deb79bfed79365))
* sharing tags with users (UI & mutation) ([a009cd0](https://github.com/neopostmodern/structure/commit/a009cd0a90a91d925132a0dea4a4248ce71596e3))
* speed up adding tags ([030037c](https://github.com/neopostmodern/structure/commit/030037cf773f1fad4071629f9d6ca9b203997eff))
* unsharing tags from users (UI & mutation) ([ee55009](https://github.com/neopostmodern/structure/commit/ee55009574d034bce08870b12c87c2c0bf94ef6d))
* updating permissions on tags (UI & mutation) ([59df706](https://github.com/neopostmodern/structure/commit/59df706fb292fc161a9a8650473f7c98137c8106))


### Performance Improvements

* **client:** enable font-swap with more fallback fonts, contributes to [#212](https://github.com/neopostmodern/structure/issues/212) ([41065e0](https://github.com/neopostmodern/structure/commit/41065e0d844eb0533338e1341383d4b000f4484a))
* **client:** extract heavy parts of add tag form ([a37b0f8](https://github.com/neopostmodern/structure/commit/a37b0f822539a6c0917ce25b625f72cbee21612d))
* **client:** fill and style pre-react page, contributes to [#212](https://github.com/neopostmodern/structure/issues/212) ([c7ac8dd](https://github.com/neopostmodern/structure/commit/c7ac8ddaef560ef04d4b7ef08cbbac79bc4d1d1c))
* **client:** preload fonts, contributes to [#212](https://github.com/neopostmodern/structure/issues/212) ([148bfca](https://github.com/neopostmodern/structure/commit/148bfcaa6e8bf84b922bb3bda5534ba435cb5007))
* **client:** reduce bundle size, contributes to [#212](https://github.com/neopostmodern/structure/issues/212) ([a8c9849](https://github.com/neopostmodern/structure/commit/a8c984993469fb79a3204850dd94865d25fd25b6))
* **client:** reducing time on first render, closes [#212](https://github.com/neopostmodern/structure/issues/212) ([471b8d7](https://github.com/neopostmodern/structure/commit/471b8d7a9b09e52a31abb26efb156dc34cbf2f10))





## [0.22.1](https://github.com/neopostmodern/structure/compare/v0.22.0...v0.22.1) (2022-12-16)


### Bug Fixes

* **client:** don't treat key presses on textarea as shortcuts ([1380e07](https://github.com/neopostmodern/structure/commit/1380e0728e6ebfe06ee9ec7261382fbcfe948f9c))
