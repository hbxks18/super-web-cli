import babel from "rollup-plugin-babel"
// import resolve from "rollup-plugin-node-resolve"
// import commonjs from "rollup-plugin-commonjs"
// import json from "rollup-plugin-json"
import hashbang from "rollup-plugin-hashbang"

export default {
  input: "src/index.js",
  output: {
    file: "bin/index.js",
    format: "cjs",
  },
  plugins: [
    // resolve(),
    hashbang(),
    // commonjs(),
    // json(),
    babel({
      exclude: "node_modules/**",
      include: ["src/**"],
      runtimeHelpers: true,
    }),
  ],
}
