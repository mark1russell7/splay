# Change history

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
