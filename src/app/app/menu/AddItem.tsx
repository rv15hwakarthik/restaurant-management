'use client'

import { useModal } from "@/components/Modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatToRs } from "@/utils/currency";


export function ItemModal({ item }) {
    const router = useRouter();
    const { closeModal } = useModal();

    const isEdit = !!item;

    const [name, setName] = useState(isEdit ? item.name : '');
    const [price, setPrice] = useState(isEdit? item.priceCents : 10000);
    const [isActive, setIsActive] = useState(isEdit ? item.active : true);
    const [isLoading, setIsLoading] = useState(false)

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const priceCents = +price;

        if (!name || !priceCents) {
            return;
        }

        setIsLoading(true);

        const body = {
            name,
            priceCents,
            active: isActive
        }

        if (isEdit){
            body.id = item.id;
        }

        try {
            await fetch("/api/menu-items", {
                method: isEdit ? "PUT" : "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
              })
            router.refresh();
            closeModal();
        } catch { 
            console.error('there was an error!') 
        }



    }

    return <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
            <label>Name</label>
            <input type="text" className="border border-zinc-300 rounded-md p-2" value={name} onChange={handleNameChange} />
        </div>
        <div className="flex flex-col gap-2">
            <label>Price (in paisa)</label>
            <input type="number" className="border border-zinc-300 rounded-md p-2" value={price} onChange={handlePriceChange} />
            <div className="mt-1 text-sm text-zinc-600">{formatToRs(price)}</div>
        </div>
        <div className="flex gap-2">
            <label>Active</label>
            <input type="checkbox" className="scale-150" checked={isActive} onChange={() => setIsActive(!isActive)}/>
        </div>
        <div className="flex justify-end"><button disabled={isLoading} className="bg-zinc-900 text-white px-4 py-2 rounded-md text-sm">{isLoading? 'Saving...' : 'Save'}</button></div>
    </form>
}

export function AddItem() {

    const { openModal } = useModal()
    const handleAddItem = () => {
        openModal(<ItemModal />, 'Add Item')
    }
  return (
    <div>
      <button className="bg-zinc-900 text-white px-4 py-2 rounded-md text-sm" onClick={handleAddItem}>+ Add Item</button>
    </div>
  )
}