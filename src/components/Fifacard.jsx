import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


import { Tilt } from "react-tilt";

import api from "../services/api";

function FifaCard() {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const groupUser = JSON.parse(localStorage.getItem("groupUser"));
    let userId = userInfo.id;
    const [user, setUser] = useState(null);

    const premmium = 1200
    const platium = 500
    const esmerald = 300

    useEffect(() => {
        if (userId) {
            getUserById(userId);

        }
    }, [userId]);

    const getUserById = async (id) => {
        try {
            const response = await api.get(`/usuarios/user/?id=${id}`);
            userId = null;
            setUser(response.data);
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
        }
    };

    const regexImgLink = (imgLink) => {
        let match = []
        match = imgLink?.match(/(?<=d\/)(.*?)(?=\/view\?)/);
        const directLink = "https://drive.google.com/thumbnail?id="
        // Verifica se houve uma correspondência e retorna o valor extraído ou null
        return match ? `${directLink}${match[0]}` : null;
    }

    return (
        <div className={`${groupUser} min-h-screen w-full flex flex-col items-center justify-center`}>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2  text-black font-bold text-lg rounded-full w-full h-12 flex items-end justify-end">
                <button
                    onClick={() => navigate("/cartinha")} // Redireciona para /login
                    className=" bg-white hover:bg-grey-500 hover:text-black text-black font-bold px-6 py-2 mr-2 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
                >
                    Voltar
                </button>
                <button
                    onClick={() => navigate("/")} // Redireciona para /login
                    className={`${groupUser}-btn-escuro ${groupUser}-btn-escuro:hover hover:text-black text-black font-bold px-6 py-2 mr-2 rounded-full shadow-lg transform transition duration-300 hover:scale-110`}
                >
                    Sair
                </button>
            </div>
            <Tilt>
                <div
                    className={
                        platium > user?.vendasTotais && user?.vendasTotais > esmerald
                            ? "relative bg-gradient-to-t from-[#3f6780e6] to-[#90ff83] rounded-xl shadow-xl p-4 w-80 text-center transition hover:scale-[1.05] cursor-pointer hover:border-4"
                            : premmium > user?.vendasTotais && user?.vendasTotais > platium
                                ? "relative bg-gradient-to-t from-[#87cefae6] to-[#989393d1] rounded-xl shadow-xl p-4 w-80 text-center transition hover:scale-[1.05] cursor-pointer hover:border-4"
                                : user?.vendasTotais > premmium
                                    ? "relative bg-gradient-to-t from-[#ff8383] to-[#ffdf34] rounded-xl shadow-xl p-4 w-80 text-center transition hover:scale-[1.05] cursor-pointer hover:border-4"
                                    : `relative ${groupUser} rounded-xl shadow-xl p-4 w-80 text-center transition hover:scale-[1.05] cursor-pointer hover:border-4`
                    }
                >

                    {/* Rating */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black font-bold text-lg rounded-lg  flex items-center justify-center">
                    <p className="mx-2 my-1">
                    ⭐

                    </p>
                    </div>
                    {/* Club and Position */}
                    <div className="mt-6">
                    <img
                        src={
                            user?.group === "horus" ? "https://i.imgur.com/AZynwEp.jpeg"
                            : user?.group === "allide" ? "https://cdn.discordapp.com/attachments/1115828357544808539/1339376722587422841/WhatsApp_Image_2025-02-12_at_10.14.20_1.jpeg?ex=67ae7f47&is=67ad2dc7&hm=b4fe0ba99a91a4cec168b9fb603bc8c631ab4b024c7fe9f448a7f4a0e1763345&"
                              : ""
                        }
                        alt="Club Logo"
                        className="w-16 h-16 sm:w-11 sm:h-9 max-sm:w-11 max-sm:h-9 mx-auto rounded-full object-cover"
                      />
                        <div className="flex justify-center items-center">
                            <p className="text-sm font-bold uppercase border-[#2a074652] text-gray-800 p-1 border-2 rounded-md px-4 my-2 shadow-md">
                                {user?.cargo}
                            </p>
                        </div>
                    </div>
                    {/* Player Image and Name */}
                    <div className="mt-4">
                        <img
                            src={regexImgLink(user?.imgUser)}
                            alt={`'s Country Flag`}
                            className="mx-auto rounded-tl-2xl rounded-br-2xl shadow-lg transition hover:scale-[1.05] w-[200px] h-[200px] object-fill cursor-pointer"
                        />
                        <h3 className="text-2xl my-4 font-bold text-[#FFF] capitalize">{user?.name}</h3>
                    </div>
                    {/* Stats */}
                    <div className="mt-12 text-sm text-gray-700">
                        <div>
                            <div className="font-bold rounded-md p-1 bg-[#ffd9005b shadow-lg border-2 border-[#e1e0d936] mx-1 hover:border-white cursor-pointer">
                                <div className="text-2xl mt-1 text-[#FFF] drop-shadow-lg text-stroke">
                                    <p>{
                                        user?.vendasA > 0 ?
                                            `Jurídico: ${user?.vendasA}` :
                                            `Comercial: ${user?.vendasB}`
                                    }</p>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Tilt>
        </div>
    );
};

export default FifaCard;
