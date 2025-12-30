// src/utils/helpers.js

/**
 * 將票券 ID 隱藏中間部分，只顯示前後
 * 例: 1234567890 -> 1234******90
 */
export const maskTicketId = (ticketId) => {
  if (!ticketId) return "N/A";
  return ticketId.replace(/^(\d{4})\d{6}(.*)$/, "$1******$2");
};

/**
 * 檢查 Firestore Timestamp 或 Date 是否為「今天」
 */
export const isSameDay = (timestamp) => {
  if (!timestamp) return false;
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() &&
         date.getMonth() === now.getMonth() &&
         date.getDate() === now.getDate();
};

/**
 * 從逗號分隔的字串中隨機抽取一個獎品
 * 例: "A, B, C" -> "B"
 */
export const getRandomPrize = (prizeString) => {
  if (!prizeString) return "神秘小禮物";
  // 支援中文或英文逗號分隔
  const prizes = prizeString.split(/[,，]/).map(p => p.trim()).filter(p => p);
  if (prizes.length === 0) return "神秘小禮物";
  return prizes[Math.floor(Math.random() * prizes.length)];
};