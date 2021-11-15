const path = require("path");

module.exports = {
    resolve: {
        fallback: {
            "zlib": require.resolve("browserify-zlib")
        }
    },
    entry: './server.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    mode: 'development'
};