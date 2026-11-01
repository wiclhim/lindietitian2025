# lindietitian2025
Created with CodeSandbox

## 季節風格切換

在店長後台的「商店設定 → 商店風格設定」選擇風格即可套用全站，不必每逢換季修改 `constants.js`。

| 風格 | 設定 ID | 首頁圖片 |
| --- | --- | --- |
| 元宵團圓 | `moon`（沿用既有 ID） | `public/images/元宵.jpg` |
| 中秋賞月 | `midautumn` | `public/images/中秋.jpg` |
| 端午飄香 | `dragonboat` | `public/images/端午.jpg` |
| 清涼仲夏 | `summer`（沿用既有 ID） | `public/images/仲夏.jpg` |

四種風格分別設定配色、活動標題、好禮文字與圖片。已儲存的 `moon`、`summer` 設定可繼續使用，無須遷移資料庫；要套用中秋或端午風格時，直接在後台選擇對應選項。
