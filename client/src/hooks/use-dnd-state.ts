'use client';

import { DropResult } from '@hello-pangea/dnd';
import { useState } from 'react';

/**
 * A reusable hook to manage the state and reordering logic for a drag-and-drop list.
 * @param initialItems The initial array of items for the list.
 * @returns An object with the current items, a setter for the items, and the onDragEnd handler.
 */
export function useDndState<T>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);

  /**
   * Handles the reordering logic when a drag operation ends.
   * @param result The result object from the drag operation.
   */
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);

    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  return {
    items,
    setItems,
    onDragEnd,
  };
}
