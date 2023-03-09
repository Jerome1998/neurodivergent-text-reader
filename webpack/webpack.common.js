const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: {
    popup: path.join(srcDir, "components/popup.tsx"),
    options: path.join(srcDir, "components/options.tsx"),
    background: path.join(srcDir, "background.ts"),
    content_script: path.join(srcDir, "content_script.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks(chunk) {
        return chunk.name !== "background";
      }
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ 
        from: ".", 
        to: "../", 
        context: "public",
        transform(content, absoluteFrom) {
          if (/manifest\.json$/.exec(absoluteFrom)) {
            // remove $schema in manifest
            return content.toString().replace(/"\$schema".+,/, "");
          }
          return content;
        }
      }],
      options: {},
    }),
    new ESLintPlugin({
      extensions: ["js", "mjs", "jsx", "ts", "tsx"],
      eslintPath: require.resolve("eslint"),
      failOnError: true,
      context: srcDir
    })
  ],
};
