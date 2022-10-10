TODO: setup monorepo Lerna/yarn workspaces.

# @stargazezone/client library

This is clients-side JS library to interact with the Stargaze blockchain. This library includes first-class support for react out of the box, however, it can be integrated non-react projects.

## @stargazezone/client/core

- Set of libraries to interact with the stargaze blockchain.

Usage:

Initialize the stargaze client in your app root:

```js
  // /src/client.ts
  import { StargazeClient } from '@stargazezone/client';

  // Create a new client instance
  const stargazeClient = new StargazeClient({
    chainInfo, // pass in chain info.
    minterCodeId, // pass in minter code id.
  });

  export stargazeClient;

```

### Connecting and getting minters

```js
// /src/components/MintersList.ts
import { stargazeClient } from '/src/client';

// connect
await stargazeClient.connect();

// get minters
const minters = await stargazeClient.minters.getAll();
```

### Wallet

```js
// /src/components/MintersList.ts
import { stargazeClient } from '/src/client';

// connect
await stargazeClient.connect();

// connect wallet
await stargazeClient.login();

const { address } = stargazeClient.wallet;

// logout:
await stargazeClient.logout();
```

## @stargazezone/client/react (UNDEVELOPED)

React specific hooks, contexts, components.

**(THIS IS UNDEVELOPED)**

Client hook/provider:

App.tsx:

```js
import { stargazeClient } from '/src/client';

<StargazeClientProvider client={stargazeClient}>
  <App />
</StargazeClientProvider>;
```

Component usage:

```js
function MintersList() {
  const { client } = useStargazeClient();

  const [minters, setMinters] = useState([]);

  useEffect(() => {
    async function fetchMinters() {
      const data = await client.minters.getAll();

      setMinters(data);
    }

    if (client) {
      fetchMinters();
    }
  }, [client]);

  return <div>{minters?.map((minter) => minter.collection.name)}</div>;
}
```

Alternatively:

```jsx
function MintersList() {
  const { client } = useStargazeClient();

  const { minters, loading, error } = useMinters();

  return <div>{minters?.map((minter) => minter.collection.name)}</div>;
}
```
