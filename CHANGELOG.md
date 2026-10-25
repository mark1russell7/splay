# Change history

## 0.2.0

### Changes

- `objectPath` puts a key with `.`, `[` or `]` in quoted brackets: `objectPath("$", "a.b")` gives `$['a.b']`. Before, it gave `$.a.b`, the same path as the nested key `{ a: { b } }`. A backslash escapes `'` and `\` in a quoted key. Other keys keep the dot form.
- `pathDepth` counts a quoted key as one level, as a key after a dot. A dot in a quoted key does not count. Before, `pathDepth("$.a.b")` gave 3 for the key `a.b`.

The path of a key with `.`, `[` or `]` changes. Thus this version is a breaking change (before 1.0.0, MINOR).

## 0.1.0

The first version on npm. Before, projects installed the package from GitHub (`github:mark1russell7/splay`).

`@mark1russell7/splay` renders any data recursively. You register a viewer for each type (`string`, `array`, `object`, or your own type such as `user`). `dispatch` infers the type of a value, calls its viewer, and gives the viewer a `render` function for the nested values. The output type is yours: React elements, Vue nodes, strings. The core has no dependencies.

### Functions

- `dispatch`, `createRegistry` and `inferType`, with `TYPE_SYMBOL` for custom types.
- Async values: `resolve` and `isDynamic`.
- Layout math: `gridLayout`, `listLayout` and `splitLayout`.
- Path helpers: `arrayPath`, `objectPath` and `pathDepth`.
- Tests of each module (42 tests).

### Changes for the release

- Node.js 22 or later (was 25).
- The package lists its license, change history and README, and leaves the tests out of the tarball.
