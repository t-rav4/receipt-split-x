import * as Crypto from "expo-crypto";

export type ReceiptItem = {
  id: string;
  name: string;
  originalPrice: number;
  finalPrice: number;
  assignedUserIds: Set<string>;
};

export function extractReceiptItems(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter(Boolean);

  const items: ReceiptItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Stop at totals section
    if (/^Total for\s+\d+\s+items/i.test(line)) {
      break;
    }

    // Match anything ending in a price
    const match = line.match(/^(.*?)\s+(-?\$?\d+\.\d{2})$/);
    if (!match) {
      continue;
    }

    let rawName = match[1];
    const priceStr = match[2];

    let name = rawName.replace(/^[*%\s]+/, "").trim();
    if (!/[A-Z]/i.test(name)) {
      continue;
    }

    const upperName = name.toUpperCase();

    // Skip obvious non-item lines
    if (
      upperName.startsWith("TOTAL") ||
      upperName.startsWith("GST") ||
      upperName.startsWith("EFT") ||
      upperName.startsWith("PURCHASE") ||
      upperName.startsWith("RRN") ||
      upperName.includes("SUBTOTAL") ||
      upperName.startsWith("CHANGE") ||
      upperName.startsWith("YOU SAVED") ||
      /^X-\d+$/.test(upperName) ||
      upperName.includes("AUD$")
    ) {
      continue;
    }

    const price = parseFloat(priceStr.replace("$", ""));

    // 👇 HANDLE DISCOUNT LINE
    if (price < 0) {
      if (items.length === 0) continue;

      // Try to match discount to previous item by partial name
      const discountBaseName = name
        .replace(/\d+\s*FOR\s*\$\d+(\.\d{2})?/i, "")
        .trim();

      // Search backwards for matching item
      for (let j = items.length - 1; j >= 0; j--) {
        if (items[j].name.includes(discountBaseName)) {
          items[j].finalPrice += price; // subtract discount
          break;
        }
      }

      continue;
    }

    // Normal purchased item
    const nextLine = lines[i + 1]?.trim();
    const qtyMatch = nextLine?.match(/^(\d+)\s+@\s+\$?(\d+\.\d{2})/i);

    let finalPrice = price;

    if (qtyMatch) {
      finalPrice = price; // keep full line total
      i++; // skip quantity line
    }

    items.push({
      id: Crypto.randomUUID(),
      name,
      originalPrice: price,
      finalPrice,
      assignedUserIds: new Set(),
    });
  }

  return items;
}
