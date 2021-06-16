const path = require("path");

module.exports = {
  // entryセクションは最初に読み込むファイルを指定する。
  // ここで指定されたファイルから別のファイルを読み込む処理が書かれていると、
  // webpackはそれらのファイルも自動的に読み込んで、最終的に１つのファイルとして出力してくれる
  entry: "./src/index.tsx",

  //   modeleのrulesセクションで、webpackに対してビルド時に追加で行う処理を記述している
  // 以下の記述では.tsで終わるファイルに対してts-loaderを実行するという意味を持つ
  //excludeは除外するファイルを正規表現で指定する。
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  //   resolveセクションは、モジュールとして解決するファイルの拡張子を指定する
  resolve: {
    extensions: [".js", ".ts", ".jsx"],
  },

  // outputセクションは、出力するファイルを指定する
  // this.以下の設定はwebpack.config.jsのおいてあるディレクトリにあるdistというディレクトリに対して
  // this.ファイル名index.jsで出力する。
  // また、変換する際はJavaScript内に書かれている相対パスのリソースげ自動的にdist/を追加してくれる
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    // ややこしいらしいので飛ばす
    publicPath: "dist/",
  },
};
