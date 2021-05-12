const {
    override,
    addLessLoader
} = require('customize-cra');

const enableE2ETest = process.env.ENABLE_E2E_TEST;

const setE2ETestSettings = () => config => {
    config.devtool = 'sourcemap';

    config.module.rules.push({
        test: /\.js$/,
        use: {
            loader: 'istanbul-instrumenter-loader',
            options: { esModules: true }
        },
        enforce: 'post',
        exclude: /node_modules|.\spec\.js$/
    });

    return config;
};

module.exports = override(
    addLessLoader({
        strictMath: true,
        noIeCompat: true,
        javascriptEnabled: true,
        localIdentName: '[local]--[hash:base64:5]'
    }),
    enableE2ETest ? setE2ETestSettings() : undefined
);