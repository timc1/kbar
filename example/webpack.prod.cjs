const path = require("path");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

module.exports = {
  mode: "production",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: "es2015",
        css: true,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "esbuild-loader",
        exclude: /node_modules/,
        options: {
          loader: "tsx",
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              // sass-loader defaults this to true, which makes sass prepend a
              // BOM whenever the output contains a non-ASCII character (the
              // emoji in Docs/styles.module.scss). style-loader injects the
              // result as the text of a <style> tag, where that BOM is not
              // stripped - it invalidates the very first rule in the sheet.
              sassOptions: { charset: false },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
};
