'use client'

import { useModal } from "@/components/Modal";
import { formatToRs } from "@/utils/currency";
import { useState } from "react";

export default function ItemCard({ item, addLine, removeLine, lines }) {
  const { name, priceCents, active } = item;
  const { openModal } = useModal()

  const count = lines.find((line) => (line.id === item.id))?.["qty"] || 0;

  return (
    <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 items-center">
        <div className="py-3">
        
            <div className="flex items-center gap-2">
                <span className="text-base font-medium text-zinc-900 dark:text-white">
                {name}
                </span>
            </div>
            <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {formatToRs(priceCents)}
            </div>
        </div>
        <div>
        {count === 0 ? (
          <button
            onClick={() => addLine(item)}
            className="rounded-xl border border-zinc-300 px-4 py-1.5 text-sm font-medium transition active:scale-95 dark:border-zinc-700"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-zinc-300 px-3 py-1.5 dark:border-zinc-700">
            <button
              onClick={() => removeLine(item)}
              className="text-lg font-medium px-1"
            >
              −
            </button>

            <span className="min-w-[1.5rem] text-center text-sm font-bold">
              {count}
            </span>

            <button
              onClick={() => addLine(item)}
              className="text-lg font-medium px-1"
            >
              +
            </button>
          </div>)}
        </div>
    </div>
  );
}