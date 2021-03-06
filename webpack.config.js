module.exports = {
  mode: 'development',
  devtool: false,
  entry: {
    options: './src/options.ts',
    background: './src/background.ts',
    contentScript: './src/contentScript.ts'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
  module: {
    rules: [
      {test: /\.ts$/, use: 'ts-loader'},
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
}