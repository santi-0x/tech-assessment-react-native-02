# Harbor

A React Native wallet for one chain. The app holds a seed in the device keychain, shows a balance, and sends ETH or USDC. A payment link can prefill a send. A receipt opens in the app. The browser asks before it signs.

- `src/screens` is the navigation tree.
- `src/wallet` builds a send from the account and the amount on the draft.
- `src/storage` keeps the seed in the keychain and preferences in AsyncStorage.
- The native projects are not in this tree. Nothing in the check talks to a device or a network.

See `docs/architecture.md`.

## Check

Requires Node 20 or newer. The check does not install packages.

```sh
sh script/run-check.sh
```
