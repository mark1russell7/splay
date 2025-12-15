package config

import "mark1russell7.cue/npm/package"

// Project configuration
// Run: npx cue-config generate

output: package.#PackageJson & {
	$schema:     "https://json.schemastore.org/package"
	name:        "@mark1russell7/splay"
	version:     "0.0.0"
	description: "Minimal recursive data renderer - framework agnostic core"
	license:     "MIT"
	author:      "Mark Russell <marktheprogrammer17@gmail.com>"
	type:        "module"
	main:        "./dist/index.js"
	types:       "./dist/index.d.ts"
	exports: ".": {
		types:  "./dist/index.d.ts"
		import: "./dist/index.js"
	}
	files: ["dist", "src"]
	scripts: {
		build:     "tsc -b"
		typecheck: "tsc --noEmit"
		clean:     "rm -rf dist .tsbuildinfo"
	}
	sideEffects: false
	devDependencies: {
		"@mark1russell7/cue": "github:mark1russell7/cue#main"
		typescript:          "^5.9.3"
	}
	keywords: []
	repository: {
		type: "git"
		url:  "https://github.com/mark1russell7/splay.git"
	}
	bugs: url:     "https://github.com/mark1russell7/splay/issues"
	homepage:      "https://github.com/mark1russell7/splay#readme"
	publishConfig: access: "public"
	engines: {
		node: ">=25.0.0"
		npm:  ">=11.0.0"
	}
}
