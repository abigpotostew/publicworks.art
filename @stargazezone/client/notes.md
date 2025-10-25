Overall structure:

- core:
  - pure js (no react) functions to do all operations.
- react
  - lightweight frontend hooks/contexts with defaults.
  - heavyweight providers that import / wrap core js functions.

Refactor / Library steps:

- [x] refactor out minters
- [ ] refactor out minting
- [ ] refactor out nft's
- [ ] refactor out using wallet
- [ ] make workspace monorepo
