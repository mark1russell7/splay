# Roadmap

This file is the plan of splay. The Status page of the site reads it.

| ID | Item | Status | Summary |
| --- | --- | --- | --- |
| C1 | The conventions check in CI | in progress | CI starts `pnpm check:conventions`, the rules of `@mark1russell7/conventions`. The package has no console call. A new call fails at once, and each call fails from 2027-01-20. |
| C2 | The build output out of git | later | A dependent installs the package from git at a commit, so git keeps `dist/`. When the dependent uses the npm release, `dist/` leaves git, and the exceptions of the rules `no-build-output` and `typed-scripts` go. |
