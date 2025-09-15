const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const precss = require("precss");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    devtool: "source-map",
    entry: ["./src/index", "./src/Editor/styles.css", "./css/Draft.css"],
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "react-draft-wysiwyg.js",
        library: "reactDraftWysiwyg",
        libraryTarget: "umd",
    },
    externals: {
        react: "react",
        immutable: "immutable",
        "react-dom": "react-dom",
        "draft-js": "draft-js",
    },
    optimization: {
        minimize: process.env.NODE_ENV === "production",
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || "production"),
            },
        }),
        new MiniCssExtractPlugin({
            filename: "react-draft-wysiwyg.css",
            chunkFilename: "[id].css",
            ignoreOrder: false,
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [autoprefixer, precss],
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{ loader: "babel-loader" }],
                exclude: /immutable\.js$|draftjs-utils\.js$/,
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            { test: /\.(png|jpg)$/, use: [{ loader: "url-loader?limit=8192" }] },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [{ loader: "url-loader?limit=10000&mimetype=image/svg+xml" }],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".json"],
    },
};
