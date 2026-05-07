# AtCoder Title Copy (ACTC)

AtCoder の問題ページで、問題タイトルを `ABC123A - Five Antennas` のような形式でコピーする userscript です。

## 機能

- 問題ページのタイトル付近に `Copy Title` ボタンを追加
- ボタンを押すと、以下形式の文字列をクリップボードへコピー
  - `CONTESTID + 問題記号 - 問題名`
  - 例: `ABC439C - 2026`
- コピー成功時にボタン表示を 2 秒間 `Copied!` に変更

## 対応ページ

`src/actc/manifest.json` に基づき、次の URL に対応しています。

- `https://atcoder.jp/contests/*/tasks/*`

## 使い方（ユーザー向け）

1. `dist/actc.user.js` を Tampermonkey / Violentmonkey に読み込む
2. AtCoder の問題ページを開く
3. `Copy Title` ボタンを押す
4. クリップボードにタイトル形式文字列がコピーされる

## 開発環境

- TypeScript
- Rollup
- Node.js + npm

## セットアップ

```bash
npm install
```

## ビルド

```bash
npm run build
```

出力:

- `dist/actc.user.js`（本番用）
- `dist/actc.dev.user.js`（開発補助用）

## 開発モード（watch）

```bash
npm run dev
```

## テスト / Lint

```bash
npm test
npm run lint
npm run lint:userscripts
```

## ディレクトリ構成（主要）

```text
src/
└─ actc/
   ├─ main.ts       # 初期化・イベント紐付け
   ├─ button.ts     # Copyボタン生成
   ├─ extractor.ts  # コンテストID・問題情報抽出
   ├─ clipboard.ts  # クリップボード処理
   └─ manifest.json # userscriptメタデータ
```

## 実装ポイント

- `main.ts`
  - `.h2` 要素にボタンを挿入
  - 重複挿入を `data-actc-copy-button="true"` で防止
- `extractor.ts`
  - URL から contest ID を抽出して大文字化
  - `.h2` の **テキストノードのみ** を対象に解析し、`解説` や他拡張の UI 文字列混入を回避
- `clipboard.ts`
  - `navigator.clipboard.writeText` でコピー
  - 成功時に `Copied!` 表示

## TypeScript 設定について

設定を用途ごとに分離しています。

- `tsconfig.json`
  - Node16 ベース（主に設定ファイル側の整合用）
- `tsconfig.build.json`
  - userscript ビルド専用（`module: esnext`, `moduleResolution: bundler`）

`rollup.config.ts` の `@rollup/plugin-typescript` は `tsconfig.build.json` を使用します。

## ライセンス

MIT
