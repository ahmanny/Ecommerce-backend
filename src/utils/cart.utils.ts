import { Types } from "mongoose";

export interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
  color: string;
  size: string;
}

export function mergeCartItems(existingItems: CartItem[], newItems: CartItem[]): CartItem[] {
  const itemMap = new Map<string, CartItem>();

  const getKey = (item: CartItem) =>
    `${item.productId.toString()}-${item.color}-${item.size}`;

  for (const item of existingItems) {
    const quantity = Number(item.quantity);
    if (isNaN(quantity)) {
      console.error(`Invalid quantity in existingItems:`, item);
      continue;
    }

    itemMap.set(getKey(item), { ...item, quantity });
  }

  for (const item of newItems) {
    const quantity = Number(item.quantity);
    const key = getKey(item);

    if (isNaN(quantity)) {
      console.error(`Invalid quantity in newItems for key: ${key}, value:`, item.quantity);
      continue;
    }

    if (itemMap.has(key)) {
      const existing = itemMap.get(key)!;
      const existingQty = Number(existing.quantity);

      if (isNaN(existingQty)) {
        console.error(`Invalid existing quantity for key: ${key}, value:`, existing.quantity);
        continue;
      }

      itemMap.set(key, {
        ...existing,
        quantity: existingQty + quantity,
      });
    } else {
      itemMap.set(key, { ...item, quantity });
    }
  }

  return Array.from(itemMap.values());
}



export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}