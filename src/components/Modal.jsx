import { useEffect, useState } from "react"
import api from "../services/api"

export default function Modal({
    visible,
    title,
    message,
    buttonTitle,
    closeModal,
    currentUserInModal
}) {

    const [newSalesValue, setNewSalesValue] = useState(0)

    useEffect(() => {
        // setNewSalesValue(currentUserInModal?.vendasA === 0 ? currentUserInModal?.vendasB : currentUserInModal?.vendasA)
        // console.log(currentUserInModal);
        
    }, [currentUserInModal])


    async function updateSales(userId, vendasA, vendasB) {
        try {
            
            const reponse = await api.put(`/usuarios/update/${userId}`, {
                vendasA,
                vendasB
            })

            
            closeModal(visible)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div className={visible ? "fixed w-full h-screen flex justify-center items-center z-[9999] p-12 bg-[#000000a3]" : "hidden"}>
                <div className="w-[30%] bg-white p-8 rounded-md shadow-md">

                    <div className="flex justify-start items-center gap-4">
                        <h1 className="text-2xl font-semibold">{title}</h1>
                        <p className="px-1 border border-blue-500 rounded-xl w-[40%] text-center">{currentUserInModal?.name}</p>
                    </div>

                    <p className="text-lg py-2">{message}</p>
                    <div>
                        <input
                            type="number"
                            className="border p-2 text-xl w-full rounded-md shadow-sm my-2"
                            placeholder="Numero de Vendas"
                            value={newSalesValue}
                            onChange={(e) => setNewSalesValue(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-center items-center my-2 gap-2">
                        <button
                            className="p-2 w-[60%] bg-blue-500 cursor-pointer rounded-md text-white font-semibold text-lg transiton hover:scale-[1.02]"
                            onClick={() => updateSales(
                                currentUserInModal?.id,
                                currentUserInModal?.vendasA !== 0 ? newSalesValue : 0,
                                currentUserInModal?.vendasB !== 0 ? newSalesValue : 0
                            )}
                        >
                            {buttonTitle}
                        </button>
                        <button
                            className="p-2 w-[40%] bg-slate-500 cursor-pointer rounded-md text-white font-semibold text-lg transiton hover:scale-[1.02]"
                            onClick={() => closeModal(visible)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}