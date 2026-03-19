# game-builder-mini

# Setup & Run

## 1. Cài dependencies

```bash id="npm_install_root"
npm install
```

```bash id="npm_install_renderer"
cd renderer
npm install
```

## 2. Chạy app

### Dev mode (`NODE_ENV=dev`)

```bash id="dev_run"
cd renderer && npm run dev
npx electron .
```

### Production mode (`NODE_ENV=pro`)

```bash id="build_run"
cd renderer && npm run build
npx electron .
```

# Mode

* Dev → dùng `localhost:5173`
* Prod → dùng `renderer/dist`
