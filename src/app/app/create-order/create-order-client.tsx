'use client'

import { useCallback, useMemo, useState } from "react";
import ItemCard from "./ItemCard";
import { formatToRs } from "@/utils/currency";
import { useModal } from "@/components/Modal";
import { useRouter } from "next/navigation";

type CartLine = {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
};

function CartIcon({ active }: { active: boolean }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.25 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Cart body */}
      <path d="M3 5h2l2.5 10.5a2 2 0 0 0 2 1.5h7.5a2 2 0 0 0 2-1.6L21 8H7" />

      {/* Wheels */}
      <circle cx={10} cy={19} r={1.5} />
      <circle cx={17} cy={19} r={1.5} />

      {/* Notification bubble */}
      {active && (
        <>
          <circle cx={20} cy={5} r={4} fill="green" stroke="none" />
        </>
      )}
    </svg>
  );
}

export function CreateOrderClient({ items }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const { openModal, closeModal } = useModal();

  const addLine = useCallback((item: Omit<CartLine, "qty">) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.id === item.id);
      if (i === -1) return [...prev, { ...item, qty: 1 }];
      const next = [...prev];
      next[i] = { ...next[i], qty: next[i].qty + 1 };
      return next;
    });
  }, []);

  const removeLine = useCallback((item: Omit<CartLine, "qty">) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.id === item.id);
      if (i === -1) return prev; 
      const line = prev[i];
  
      if (line.qty === 1) {
        return prev.filter((l) => l.id !== item.id);
      }
  
      const next = [...prev];
      next[i] = { ...line, qty: line.qty - 1 };
      return next;
    });
  }, []);

  const subtotalCents = useMemo(
    () => lines.reduce((s, l) => s + l.priceCents * l.qty, 0),
    [lines],
  );

  const handleCartOpen = () => {
    if (!subtotalCents) return; 

    openModal(<Cart lines={lines} subtotalCents={subtotalCents} closeModal={closeModal} />, 'Confirm Order')
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-4 pt-6 flex justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Create order</h1>
        <span className="flex gap-2 items-center">
          {subtotalCents ? <span className="font-bold">{formatToRs(subtotalCents)}</span> : undefined}
          <div onClick={handleCartOpen} role="button">
            <CartIcon active={!!subtotalCents} />
          </div>
        </span>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col gap-4 px-4 pb-2 overflow-auto flex-1">
        <section aria-label="Menu items">
          {!items?.length ? <div className="text-sm text-zinc-600 dark:text-zinc-400">There are no items in the menu yet. Please add items in the menu first to create an order.</div> : 
          <><h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Items
          </h2>
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
             <ItemCard key={item.id} item={item} addLine={addLine} removeLine={removeLine} lines={lines} />
            ))}
          </ul></>}
        </section>
      </div>
    </div>
  );
}

function Cart({ lines, subtotalCents, closeModal }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePlaceOrder = async () => {
    setIsLoading(true);

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            menuItemId: l.id,
            quantity: l.qty,
          })),
        }),
      })
    router.replace("/app/orders");
    closeModal();
    } catch(e) {
      console.error('Failed to place the order!', e)
      setIsLoading(false);
    }
  }

  return <div className="flex flex-col gap-2">
    {lines.map((line, i) => (
      <div key={i} className="flex gap-4 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 py-3">
        <div className="flex flex-col">
          <span>{line.name}</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Qty: {line.qty}</span>
        </div>
        <div>
          {formatToRs(line.priceCents * line.qty)}
        </div>
      </div>
    ))}
    <div className="flex justify-between py-3 text-lg font-bold">
      <span>Total</span>
      <span>{formatToRs(subtotalCents)}</span>
    </div>
    <div>
      <button onClick={handlePlaceOrder} disabled={isLoading} className="bg-zinc-900 text-white px-4 py-2 rounded-md w-full">
        {isLoading ? 'Placing...' : 'Place Order'}
      </button>
    </div>
  </div>
}