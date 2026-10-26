# 福岡食住玩！FUKUOKA POP!

2027 年 5 月福岡＋由布院 5 日 4 夜旅行企劃，做成一個手機優先的卡通互動網頁：
Three.js 3D 小島、日／夜場景、景點與美食卡通插畫、逐日行程、預算、出發清單。

## 快速開始

### Windows（最簡單）

1. 雙擊 `start.ps1`（或右鍵「以 PowerShell 執行」）。
2. 電腦開 `http://localhost:4173`。
3. 手機連同一個 Wi-Fi，開終端機顯示的 `http://192.168.x.x:4173`。

如果 PowerShell 執行政策阻止：

```powershell
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

> 唔好直接雙擊根目錄的 `index.html`：根目錄係 source，真正 build 好的版本在 `dist/`，請用 `start.ps1` 或上面的網址開啟。

### 用 pnpm / Node

```bash
pnpm install
pnpm build
pnpm serve
```

`pnpm serve` 會同時印出 localhost 同區網網址。PORT 可以自訂：

```powershell
$env:PORT=8080; pnpm serve
```

### 已經 build 好，只想用 Python serve

```powershell
python -m http.server 4173 --directory dist
```

## 功能

- **3D 福岡小島**：福岡塔、中洲屋台、拉麵角色、摩天輪、太宰府神社、紫藤、新幹線、水面與浮島。
- **動態效果**：拖曳旋轉、日夜切換、角色彈跳、祭典燈籠、蒸氣、花瓣、火車、雲朵、手機觸感回饋。
- **6 個卡通景點**＋**6 個卡通美食**：可點開詳情。
- **5 日 4 夜行程**：Day 1–5 分頁、時間表、路線圖、是日必食、雨天備案、貼士。
- **下載 .ics**：一鍵匯入 Google Calendar / Apple Calendar。
- **預算表、手信清單、出發 checklist**（checklist 進度存在 localStorage）。
- **PWA**：部署到 HTTPS 後可以「加到主畫面」，service worker 會 cache 頁面離線打開。

## 行程一覽

| 日 | 日期 | 主題 | 重點 |
|---|---|---|---|
| Day 1 | 2027/5/10（一） | 抵達・博多站周邊 | 喜水丸、博多站／運河城、博多一双 |
| Day 2 | 2027/5/11（二） | 太宰府・天神 | 太宰府天滿宮、笠乃家、天神地下街、楽天地 |
| Day 3 | 2027/5/12（三） | 由布院・溫泉一泊 | 由布院之森 1 号、湯の坪街道、吾亦紅 |
| Day 4 | 2027/5/13（四） | 金鱗湖・返回博多 | 金鱗湖晨霧、由布まぶし心、東長寺、中洲屋台 |
| Day 5 | 2027/5/14（五） | 手信・返香港 | 博多一番街、彈性午餐、UO695 |

以 UO600 約 12:00 抵達、UO695 20:35 起飛為準；酒店 15:00 才入房，先寄行李。

## 重要假設 / 出發前確認

- 2027/5/10–14，已過日本黃金週；由布院之森全車指定席，行程以你已劃位的 1 号／2 号為準。
- 由布院旅館晚餐加 ¥2,500＋溫泉稅 ¥250，總共約 ¥2,750/人，要現金。
- 福岡塔 2026 年票價為大人 ¥1,000、09:30–22:00；2027 年可能調整（此景點列作後備）。
- 太宰府天滿宮御本殿 2026 年 9 月完成 124 年來大修後重新開放；參拜時間以官方為準。
- 海之中道 Flower Picnic 以 2026 花季作參考，列作後備景點；2027 花況與日期出發前再看官方。
- 所有價格、營業時間、交通班次只作預算，出發前 2–4 星期請再確認。

## 專案結構

```text
index.html              頁面
src/main.js             UI、互動、日曆、PWA
src/scene.js            Three.js 3D 小島
src/art.js              景點 / 美食 SVG 插畫
src/data.js             行程、景點、美食、預算、清單
src/styles.css          手機優先樣式
assets/fonts/           本地字體（jf open 粉圓 subset，SIL OFL）
assets/icons...         PWA icons
scripts/build.mjs       esbuild bundle → dist/
scripts/serve.mjs       靜態 server + 區網網址
dist/                   已 build 版本
```

## 部署

把 `dist/` 上傳到任何靜態 hosting（Netlify、Vercel、Cloudflare Pages、GitHub Pages）即可。
PWA 的 service worker 需要 HTTPS 或 localhost。

## 字體

`jf open 粉圓`（jf open-huninn），SIL Open Font License 1.1，只 subset 了本頁用到的字元。
License 在 `assets/fonts/OFL.txt`。

## 資料來源

- 福岡塔官方：https://www.fukuokatower.co.jp/charge/
- 太宰府天滿宮官方：https://www.dazaifutenmangu.or.jp/tw/
- 海之中道 Flower Picnic：https://www.crossroadfukuoka.jp/en/event/14030
- JR 九州 由布院之森：https://www.jrkyushu.co.jp/english/train/yufuin_no_mori.html
