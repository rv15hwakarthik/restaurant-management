'use client'

import { useModal } from "@/components/Modal";
import { formatToRs } from "@/utils/currency";
import { ItemModal } from "./AddItem";

export default function ItemCard({ item }) {
  const { name, priceCents, active } = item;
  const { openModal } = useModal()

  const handleEdit = () => {
    openModal(<ItemModal item={item} />, `Edit ${item.name}`)
  }

  return (
    <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 items-center">
    <div className="py-3">
      
      {/* Top row */}
      <div className="flex items-center gap-2">
        <span className="text-base font-medium text-zinc-900 dark:text-white">
          {name}
        </span>

        {/* Status dot */}
        <span
          className={`w-3 h-3 rounded-full ${
            active ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </div>

      {/* Price */}
      <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {formatToRs(priceCents)}
      </div>
    </div>
    <button onClick={handleEdit}>Edit</button>
    </div>
  );
}