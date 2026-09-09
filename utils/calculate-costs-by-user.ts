import { ReceiptItem } from "./pdf-splitting";

export function calculateCostsByUser(
  receiptItems: ReceiptItem[],
  spliteeIds: Set<string>,
) {
  return receiptItems.reduce<Record<string, number>>((costs, item) => {
    const usersToCharge =
      item.assignedUserIds.size > 0 ? item.assignedUserIds : spliteeIds;

    if (usersToCharge.size === 0) {
      return costs;
    }

    const costPerUser = item.finalPrice / usersToCharge.size;

    for (const userId of usersToCharge) {
      costs[userId] = (costs[userId] ?? 0) + costPerUser;
    }

    return costs;
  }, {});
}
