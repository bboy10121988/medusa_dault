# Medusa Fullstack (官方 Starters 聚合)

此專案聚合：
- 後端：`medusa-starter-default` (Medusa v2) （資料夾 `backend`）
- 前端：`nextjs-starter-medusa` （資料夾 `frontend`）

並以 Yarn workspaces 管理。

## 結構
```
/backend   # Medusa 服務 (Port 9000)
/frontend  # Next.js Storefront (Port 8000)
```

## 需求
- Node.js 20+
- PostgreSQL (建議) 或 SQLite (預設 dev)
- Yarn (v3+，frontend 內含 yarn berry 設定)

## 安裝
根目錄安裝所有工作區依賴：
```bash
yarn install
```

## 環境變數
### Backend (`backend/.env` 建議建立)
複製 `backend/.env.template` 或新增：
```
DATABASE_URL=postgres://user:pass@localhost:5432/medusa_dev
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:7000,http://localhost:8000
AUTH_CORS=http://localhost:8000
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
```

### Frontend (`frontend/.env.local`)
複製 `frontend/.env.template` (若存在) 或新增 Stripe key：
```
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectId
NEXT_PUBLIC_SANITY_DATASET=production
```

## 啟動服務
單獨啟動：
```bash
yarn dev:backend   # 於 9000
yarn dev:frontend  # 於 8000
```
同時啟動（根目錄）：
```bash
yarn dev
```

## 初始化資料
進入 backend 後執行種子：
```bash
cd backend
yarn seed
```
建立管理員使用者 (互動式或指令)：
```bash
yarn medusa user -e admin@local -p supersecret
```
建立台灣區域 / 幣別 / 倉庫 / 銷售渠道 / Publishable Key：
```bash
yarn seed:taiwan
```
指令完成後，於終端輸出會看到 Taiwan publishable API key，將其放入：
```
frontend/.env.local  -> NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=...
backend/.env         -> PUBLISHABLE_API_KEY=...
```

## 測試 API
```bash
curl http://localhost:9000/store/products | jq
```

## 常見問題
1. Node 版本：確保 >=20，否則部分套件 (React 19 RC / Medusa v2) 可能報錯。
2. Yarn vs npm：frontend 使用 Yarn Berry，請在根目錄使用 `yarn` 以避免鎖檔衝突。
3. 資料庫切換：在 `.env` 設定 `DATABASE_URL` 為 Postgres；若不設定則預設使用 SQLite (檔案位於 backend 根目錄)。

## 下一步建議
- 啟用 Stripe：在前端 `.env.local` 與後端設定對應金流 provider。
- 新增自訂 Module / Workflow。
- 擴充前端 SEO、RSC cache 與 edge 部署。
- 加入 Docker Compose 以一鍵啟動 DB/Redis。
- Sanity：於 `frontend` 執行 `yarn studio` 啟動內容管理 (路徑 /studio)。

---
歡迎依需求再提出要整合的功能（Docker、CI、Testing、Plugin 範例等）。
