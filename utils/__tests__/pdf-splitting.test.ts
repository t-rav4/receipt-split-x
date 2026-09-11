import { extractReceiptItems } from "../pdf-splitting";

describe("extractReceiptItems", () => {
  it("should apply a multi-buy discount when the promotion label differs from the item name", () => {
    const items = extractReceiptItems(`
      COLES BEEF BURGER 500GRAM        17.00
         2 @ $8.50 EACH
      CLASSIC BRGERS & SAU 2 FOR $12    -$5.00
      Total for 2 items:               $12.00
    `);

    expect(items).toHaveLength(1);
    expect(items[0].originalPrice).toBe(17);
    expect(items[0].finalPrice).toBe(12);
  });

  it("should calculate the correct total for the Coles receipt item section", () => {
    const items = extractReceiptItems(`
      COLES BEEF BURGER 500GRAM        17.00
         2 @ $8.50 EACH
      CLASSIC BRGERS & SAU 2 FOR $12    -$5.00
      COLES PINEAPPLE SLIC 425GRAM      2.00
      COLES BURGER SAUCE 360GRAM        3.20
      WICKED BURGER PICKLE 500GRAM      2.70
      COLES FREE RANGE 6PK 300GRAM      4.40
      % TOSCANO BURGER BUN 100GRAM      4.32
         2 @ $2.16 EACH
      COLES COS LETTUCE 1EACH           2.90
      RED ONIONS PERKG                  1.35
         0.246 kg NET @ $5.50/kg
      GOURMET TOMATOES PERKG            1.47
         0.301 kg NET @ $4.90/kg
      BROWN ONIONS PERKG                0.70
         0.166 kg NET @ $4.20/kg
      HASS AVOCADO 1EACH                5.00
         2 @ $2.50 EACH
      COLES SOFT WHOLEMEAL 700GRAM      2.80
      Total for 15 items:               $42.84
    `);

    const total = items.reduce((sum, item) => sum + item.finalPrice, 0);

    expect(items).toHaveLength(12);
    expect(items[0].finalPrice).toBe(12);
    expect(total).toBeCloseTo(42.84, 2);
  });

  it("should apply an unmatched X FOR Y discount only to the preceding item", () => {
    const items = extractReceiptItems(`
      FIRST ITEM 10.00
      SECOND ITEM 8.00
      UNMATCHED PROMO 2 FOR $10 -3.00
      Total for 2 items:               $15.00
    `);

    expect(items).toHaveLength(2);
    expect(items[0].finalPrice).toBe(10);
    expect(items[1].finalPrice).toBe(5);
  });
});
