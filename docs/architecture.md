# Architecture

Harbor is a React Native wallet for chain id 1. It shows a balance, sends ETH or USDC, opens a receipt, and signs a transaction from a page in the browser. The device authenticator gates a send and a seed reveal. Nothing in the JS bundle opens a socket.

```
  Home ---- Send ---- authenticator ---- sendCall
    |         ^
    |         |
    |      harbor://pay
    |
    +---- Activity ---- receipt URL
    |
    +---- Browser ---- message ---- sheet ---- authenticator
    |
    +---- Settings ---- preferences
              |
              +---- Backup ---- authenticator ---- keychain
```

## Send

A send draft carries the unlocked account, the recipient, the human amount, the asset, and chain id 1. The account is the one passed into the draft. Changing accounts changes `from`.

The confirmation shows the human amount, the asset symbol, the sender, and the recipient. The transaction uses that same sender and the same amount as an integer. The integer is the human amount scaled by that asset's decimals. ETH has 18 decimals and is a native transfer: the integer is `value` and `data` is `0x`. USDC has 6 decimals: `to` is the token, `value` is zero, and `data` is `transfer(address,uint256)` to the recipient. A non-positive amount is rejected. A draft for another chain id is rejected.

## Authenticator

`approve` is the gate for a send, a browser signature, and a seed reveal. The prompt follows the device authenticator: cancel and a failed match both resolve. They do not reject. The result has `success: true` only when the person authenticated. `approve` returns `{ ok: true }` only in that case. Otherwise it returns `{ ok: false }` and the screen does not broadcast or reveal.

## Storage

The seed is a keychain item under `app.harbor.seed`. On iOS the item is `AccessibleWhenUnlockedThisDeviceOnly` and `synchronizable` is false, so it is readable only while this device is unlocked and it is not copied to iCloud Keychain. On Android the item uses `KeystoreAESCBC` with `SECURE_HARDWARE`. The seed is not written to AsyncStorage.

Currency and theme are preferences. They live in AsyncStorage. They are not secrets. `preferenceOptions` is not the seed item.

`createMemoryStore` is an in-process stand-in for the check. The app builds the keychain store.

## Payment links

A payment link is `harbor://pay` with `to`, `amount`, and `asset`. The scheme is `harbor:` and the host is exactly `pay`. Any other scheme or host is ignored. The draft keeps those three fields. A `data` query parameter is not part of the draft and is not put on the transaction. The send screen rebuilds the draft from the recipient, the amount, and the asset the person can still edit.

## Receipts

A receipt URL is loaded only when the scheme is `https` and the host is exactly `receipts.harbor.app`. Userinfo is rejected. The WebView source is that URL and nothing else. It does not send the API bearer, a cookie, or any wallet secret.

## Browser

The address bar accepts an `https` URL and remembers that page's origin. A script URL or an `http` URL is not opened. A message is accepted only when its page origin equals the origin that was opened. Scheme and host both have to match. A different host, including one that merely contains the opened host, is ignored.

`eth_sendTransaction` shows a sheet and signs one transaction. The sheet's recipient, value, and data are `params[0]`. A `display` object on the message is not a source for those fields. When `params[0].from` is present it has to be the unlocked account. The signed fields are the same recipient, value, and data the sheet shows. The authenticator has to accept the signature before it is returned.

## Helpers

`format/group` inserts thousands separators. `telemetry/window` keeps a rolling mean. Neither is called by the app.
