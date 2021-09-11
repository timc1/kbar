const path = require("path");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

module.exports = {
  mode: "development",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    historyApiFallback: true,
    static: path.resolve(__dirname, "dist"),
    hot: true,
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
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
};
