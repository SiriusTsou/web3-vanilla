const path = require('path')

const babelConfig = {
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3,
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    ['@babel/plugin-transform-runtime', {
      helpers: true,
      regenerator: true,
      useESModules: true,
    }]
  ]
}

module.exports = {
  target: 'node',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  externals: {
    'ethers': 'ethers',
    '@0x/subproviders': '@0x/subproviders',
    '@walletconnect/web3-subprovider': '@walletconnect/web3-subprovider',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // options: babelConfig,
        }
      }
    ]
  },
}