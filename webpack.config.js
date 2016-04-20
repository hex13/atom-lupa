module.exports = {
    context: __dirname,
    entry: './index.js',
    externals: {
        atom: 'require("atom")'
    },
    module: {
        loaders: [
            {test: /\.coffee$/, loader: 'coffee-loader'},
            {test: /\.json$/, loader: 'json-loader'},
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ["", ".js", ".coffee"]
    },
    target: "atom"
}
