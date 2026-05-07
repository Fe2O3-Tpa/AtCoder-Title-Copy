# VSCode + WSL2(Ubuntu) で始める Userscript 開発環境構築ガイド

この文書は、**VSCode + WSL2(Ubuntu) 環境で、知識ゼロの状態から Userscript 開発を再開できる**ように作っています。  
対象プロジェクト: `AtCoder-Title-Copy`

## 0. ゴール

このガイドのゴールは次の2つです。

1. WSL2(Ubuntu) 上でこのプロジェクトをビルドできる
2. 生成した userscript (`dist/actc.user.js`) をブラウザで動かせる

## 1. 事前確認（Windows 側）

### 1-1. WSL2 の状態確認
PowerShell で実行:

```powershell
wsl -l -v
```

`Ubuntu` が `Version 2` で表示されればOKです。

### 1-2. VSCode の確認
- VSCode をインストール済みであること
- 拡張機能 `WSL`（Microsoft 製）を入れていること

## 2. Ubuntu 側の基本セットアップ

Ubuntu ターミナルで実行:

```bash
sudo apt update
sudo apt install -y curl git build-essential
```

## 3. Node.js / npm の導入

このプロジェクトでは Node.js と npm を使います。  
Ubuntu で `nvm` を使って入れる方法が安全です。

### 3-1. nvm インストール

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

インストール後、ターミナルを開き直すか、以下を実行:

```bash
source ~/.bashrc
```

### 3-2. Node.js(LTS) インストール

```bash
nvm install --lts
nvm use --lts
```

### 3-3. 確認

```bash
node -v
npm -v
```

バージョンが表示されればOKです。

## 4. プロジェクトを VSCode + WSL で開く

### 4-1. リポジトリ取得（未取得の場合）

```bash
git clone https://github.com/Fe2O3-Tpa/AtCoder-Title-Copy.git
cd AtCoder-Title-Copy
```

既に手元にあるなら、そのディレクトリへ移動してください。

### 4-2. VSCode で開く

WSL ターミナルで:

```bash
code .
```

左下に `WSL: Ubuntu` と出ていれば、WSL 上のプロジェクトを正しく開けています。

## 5. 依存関係のインストール

プロジェクトルートで:

```bash
npm install
```

## 6. ビルド

```bash
npm run build
```

成功すると以下が生成されます。

- `dist/actc.user.js`（本番用）
- `dist/actc.dev.user.js`（開発補助用）

## 7. 変更監視しながら開発（任意）

```bash
npm run dev
```

ファイル変更を監視して自動再ビルドします。停止は `Ctrl + C`。

## 8. ブラウザに userscript を入れる

Userscript マネージャ（Tampermonkey / Violentmonkey）を使います。

### 8-1. 拡張機能をインストール
- Chrome か Edge に Tampermonkey（または Violentmonkey）を追加

### 8-2. `actc.user.js` を読み込む
方法はどちらでもOKです。

1. `dist/actc.user.js` をブラウザへドラッグ＆ドロップ
2. 拡張機能の「新規スクリプト作成」に中身を貼り付けて保存

このスクリプトは以下URLで動く設定です。

- `https://atcoder.jp/contests/*/tasks/*`

## 9. 動作確認

1. AtCoder の問題ページを開く
2. スクリプトが有効になっていることを拡張機能で確認
3. 問題名コピー機能が動けば成功

## 10. よくある詰まりどころ

### 10-1. `code .` が効かない
VSCode のコマンドが PATH に通っていない可能性があります。  
VSCode から WSL フォルダを「Open Folder」で開いて回避できます。

### 10-2. `node` / `npm` がない
`nvm` の読み込みができていない可能性があります。  
`source ~/.bashrc` 後に再確認してください。

### 10-3. `npm install` で失敗
ネットワークやプロキシ設定が原因のことがあります。  
時間を空けて再実行、または社内ネットワーク設定を確認してください。

### 10-4. `npm run build` は通るがブラウザで動かない
- userscript が有効化されているか
- 対象URLが `atcoder.jp/contests/.../tasks/...` か
- 古いスクリプトが残っていないか
を確認してください。

## 11. このプロジェクトでよく使うコマンド

```bash
npm install
npm run build
npm run dev
npm test
npm run lint
```

## 12. 最短手順だけ見たい人向け

```bash
# Ubuntu 側
git clone https://github.com/Fe2O3-Tpa/AtCoder-Title-Copy.git
cd AtCoder-Title-Copy
npm install
npm run build
```

その後 `dist/actc.user.js` を Tampermonkey/Violentmonkey に読み込めば開始できます。
