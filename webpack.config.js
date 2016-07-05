module.exports = {
    context: __dirname,
    entry: './index.js',
    externals: {
        atom: 'atom',
        // react: 'require("react")',
        // 'react-dom': 'require("react-dom")',
    },
    module: {
        loaders: [
            {test: /\.json$/, loader: 'json-loader'},
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        ]
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        libraryTarget: 'commonjs'
    },
    resolve: {
        extensions: ["", ".js", ".json"]
    },
    target: "atom"
}
