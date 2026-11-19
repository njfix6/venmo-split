# Pot Tracker

A phone web app for a shared ceramics studio. It answers two questions for
potters: "has my work been fired?" and "which shelf is it on?".

## How it works

Nothing is attached to the pots, and nobody scans individual pieces.

1. **Unloading a kiln.** The kiln tech photographs each layer from above (the
   kilns are top-loading, so every pot is visible), then snaps the label on the
   rack shelf that layer went onto, or picks the shelf from a list.
2. **Finding your work.** Potters open the Firings feed, spot their own pot in
   a layer photo and read the shelf name on it. Tapping the pot marks it as
   theirs and adds it to "My pots".
3. **Setup, once.** Name the kilns and rack shelves, print the label sheet and
   stick each label on the front edge of its shelf.

## Current limits

- Everything is stored on the one phone or browser it is used in. There is no
  shared server yet, so a tech's photos do not reach other people's phones.
- No accounts: a person is just the name typed in Setup.
- Pots moved between shelves after unloading are not tracked.

## Run it

```
npm install
npm run dev
```

Open the address it prints. To try it on a phone, use the "Network" address
while the phone is on the same Wi-Fi. The app starts with sample firings;
Setup has buttons to clear them or load them again.
