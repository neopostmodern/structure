# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.23.1](https://github.com/neopostmodern/structure/compare/v0.23.0...v0.23.1) (2023-05-20)


### Bug Fixes

* **server:** only send back minimum version when not fulfilled ([45fe6e7](https://github.com/neopostmodern/structure/commit/45fe6e74c9af9b319c0f3d3c9e9df80507ca1caa))
* sort notes by createdAt for server cache stability ([30460cf](https://github.com/neopostmodern/structure/commit/30460cf96252be57a728e96e8ee48063cdfdea31))





# [0.23.0](https://github.com/neopostmodern/structure/compare/v0.22.1...v0.23.0) (2023-05-18)


### Bug Fixes

* always allow users to unshare another user's tag from themselves ([490c1c0](https://github.com/neopostmodern/structure/commit/490c1c04f8c9e740fce496dc547a69ea5dd23fe6))
* **server:** add ownership tag to created URL notes (links) ([3f4d280](https://github.com/neopostmodern/structure/commit/3f4d28004636abb8458747b4a926b741fceb7e85))
* **server:** pass redirect as callback to `.logout`, fixes [#209](https://github.com/neopostmodern/structure/issues/209) ([298b58d](https://github.com/neopostmodern/structure/commit/298b58d72903c3b51bb556476ad5ee8dc0a91003))
* **server:** retain local GraphQL playground ([74454d8](https://github.com/neopostmodern/structure/commit/74454d85584d2be8d7168d77f2ab5296c7e9676c))
* **server:** simplify data export, also making it compatible with new data structure ([b0c4014](https://github.com/neopostmodern/structure/commit/b0c4014d2e977ab625325d3805013292f318abd1))


### Features

* **client:** show basic metadata for notes and tags on their page ([3c53b79](https://github.com/neopostmodern/structure/commit/3c53b794879a653ec909c88fe4f2b23d266cfdda))
* **server:** add user field to cache entry ([55dd049](https://github.com/neopostmodern/structure/commit/55dd0491eeb7760b3583c88ca49160d77a64389e))
* **server:** delete old cache entries ([fb1f9a8](https://github.com/neopostmodern/structure/commit/fb1f9a8487dbb2d955b47364b333783ca46b5f42))
* **server:** improved logging ([c59f6e0](https://github.com/neopostmodern/structure/commit/c59f6e0979f613e00724140622763d31dbe18980))
* **server:** performance measurement utilities ([24d1fb9](https://github.com/neopostmodern/structure/commit/24d1fb9fe59d9b31a7fa702ba46247f0674a4eef))
* sharing notes by tag with permission system, closes [#49](https://github.com/neopostmodern/structure/issues/49) ([623b764](https://github.com/neopostmodern/structure/commit/623b764818f6034d5349b14f79deb79bfed79365))
* sharing tags with users (UI & mutation) ([a009cd0](https://github.com/neopostmodern/structure/commit/a009cd0a90a91d925132a0dea4a4248ce71596e3))
* speed up adding tags ([030037c](https://github.com/neopostmodern/structure/commit/030037cf773f1fad4071629f9d6ca9b203997eff))
* unsharing tags from users (UI & mutation) ([ee55009](https://github.com/neopostmodern/structure/commit/ee55009574d034bce08870b12c87c2c0bf94ef6d))
* updating permissions on tags (UI & mutation) ([59df706](https://github.com/neopostmodern/structure/commit/59df706fb292fc161a9a8650473f7c98137c8106))





## [0.22.1](https://github.com/neopostmodern/structure/compare/v0.22.0...v0.22.1) (2022-12-16)

**Note:** Version bump only for package @structure/server
