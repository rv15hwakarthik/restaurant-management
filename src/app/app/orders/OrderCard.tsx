'use client'

import { formatToRs } from "@/utils/currency";

export function OrderCard({ order }) {
    return (<div
        key={order.id}
        className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
        {/* Header */}
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
                Order #{order.id.slice(0, 6)}
            </span>
            <span className="text-xs text-zinc-500">
  {new Date(order.createdAt).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  })}
</span>
        </div>

        {/* Items */}
        <div className="mt-3 flex flex-col gap-1 text-sm">
            {order.lines.map((line) => (
                <div
                    key={line.id}
                    className="flex justify-between text-zinc-700 dark:text-zinc-300"
                >
                    <span>
                        {line.menuItem.name} × {line.quantity}
                    </span>
                    <span>
                        {formatToRs((line.unitPriceCents * line.quantity))}
                    </span>
                </div>
            ))}
        </div>

        {/* Total */}
        <div className="mt-3 flex justify-between border-t pt-2 text-sm font-medium">
            <span>Total</span>
            <span>{formatToRs(order.totalCents)}</span>
        </div>
    </div>)
}