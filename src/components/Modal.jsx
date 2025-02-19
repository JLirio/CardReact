import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Modal({
    visible,
    title,
    message,
    buttonTitle,
    closeModal,
    currentUserInModal
}) {

    const [newSalesValue, setNewSalesValue] = useState(0);
    let groupU = useParams();

    const [groupUser, setGroupUser] = useState(groupU.group || "");

    useEffect(() => {
        // Dependendo do estado do modal ou do usuário, você pode fazer algum efeito colateral aqui, se necessário.
    }, [currentUserInModal]);

    async function updateSales(userId, vendasA, vendasB) {

        try {
            const response = await api.put(`/usuarios/update/${userId}`, {
                vendasA,
                vendasB
            });

            closeModal(visible); // Fecha o modal após a atualização
        } catch (error) {
            console.error(error);
        }
    }

    function handleUpdate() {
        let vendasAChange = 0;
        let vendasBChange = 0;

        if (currentUserInModal?.cargo.toLowerCase().includes("jurídico") || currentUserInModal?.cargo.toLowerCase().includes("juridico")) {
            vendasAChange = Number(newSalesValue);
        } else if (currentUserInModal?.cargo.toLowerCase().includes("comercial")) {
            vendasBChange = Number(newSalesValue);
        }

        updateSales(currentUserInModal?.id, vendasAChange, vendasBChange);
    }

    return (
        <>
            <div className={visible ? "fixed w-full h-screen flex justify-center items-center z-[9999] p-12 bg-[#000000a3]" : "hidden"}>
                <div className="w-[30%] bg-white p-8 rounded-md shadow-md">
                    <div className="flex justify-start items-center gap-4">
                        <h1 className="text-2xl font-semibold">{title}</h1>
                        <p className="px-1 border border-[#e7b56a]  rounded-xl w-[40%] text-center">{currentUserInModal?.name}</p>
                    </div>

                    <p className="text-lg py-2">{message}</p>
                    <div>
                        <input
                            type="number"
                            className="border p-2 text-xl w-full rounded-md shadow-sm my-2"
                            placeholder="Número de Vendas"
                            value={newSalesValue}
                            onChange={(e) => setNewSalesValue(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-center items-center my-2 gap-2">
                        <button
                            className={`p-2 w-[60%] ${groupUser}-btn-alert text-white cursor-pointer rounded-md  font-semibold text-lg transition hover:scale-[1.02]`}
                            onClick={handleUpdate}
                        >
                            {buttonTitle}
                        </button>
                        <button
                            className="p-2 w-[40%] bg-slate-500 cursor-pointer rounded-md text-white font-semibold text-lg transition hover:scale-[1.02]"
                            onClick={() => closeModal(visible)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
