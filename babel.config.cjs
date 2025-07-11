module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  plugins: [
    "babel-plugin-transform-import-meta",
    "@babel/plugin-transform-runtime",
  ],
};
