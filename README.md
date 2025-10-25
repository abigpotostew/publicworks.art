# PublicWorks.art

Progress Notes:
- Login-- need to separate the connect wallet with the login with token flow

todo:
- [x] remove the user required redirect-- change it to an error message
- [x] add start date and more validations on the confirm page
- prettify the confirm page
- need to differentiate user with token with just address
- skeleton loaders
- upload directly to ipfs instead of nft.storage
- [x] add dutch auction support
- documentation in notion

- Add additional description to the edit flow
- add a button to open to fullscreen!
- [x] user hidden visibility
- [x] delete project
- bring your own ipfs cid
- consolidate create flow

- [x] index work tokens by contract address instead of work id so that replacing the contract doesn't screw up the tokens.
- replace the live preview with a static image
- only show the live media on create on first page.
- Allow collector exploration (random hash)
- [x] load images from the gcp storage (requires making the image bucket public)
- give creator option to show live view or static image
- [x] a page for users to see the status of a mint (ie progress in the render pipeline)

- performance:
  - use edge functions for most things

visual bugs:
- [x] homepage feature works sizing is weird


# todo
 - now that i'm using dynamo db, i should switch to using edge lambdas for the apis on the webapp
