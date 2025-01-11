import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


import { Tilt } from "react-tilt";

import api from "../services/api";

function FifaCard() {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let userId = userInfo.id;
    const [user, setUser] = useState(null);


    useEffect(() => {
        if (userId) {
            getUserById(userId);
        }
    }, [userId]);

    const getUserById = async (id) => {
        try {
            const response = await api.get(`/usuarios/user/?id=${id}`);
            console.log(response.data);
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
        <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 min-h-screen w-full flex flex-col items-center justify-center">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2  text-black font-bold text-lg rounded-full w-full h-12 flex items-end justify-end">
                <button
                    onClick={() => navigate("/cartinha")} // Redireciona para /login
                    className=" bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 mr-2 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
                >
                    Voltar
                </button>
                <button
                    onClick={() => navigate("/")} // Redireciona para /login
                    className=" bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 mr-2 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
                >
                    Sair
                </button>
            </div>
            <Tilt>
                <div className="relative bg-gradient-to-t from-[#3c6ef6bb] to-[#fc33b2a8] rounded-xl shadow-xl p-4 w-80 text-center transition hover:scale-[1.05] cursor-pointer hover:border-4">
                    {/* Rating */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black font-bold text-lg rounded-lg w-12 h-12 flex items-center justify-center">
                        {user?.group}
                    </div>
                    {/* Club and Position */}
                    <div className="mt-6">
                        <img
                            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAbEP9_UogxxGxImR5hlQcg5fR73yIFlH3U0uBv3yGVeLFUJGrOb-glHEfy04&s=10"}
                            alt="Club Logo"
                            className="w-12 h-12 mx-auto rounded-full object-cover"
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
                        <h3 className="text-2xl my-4 font-bold text-[#2C2C2C] capitalize">{user?.name}</h3>
                    </div>
                    {/* Stats */}
                    <div className="mt-12 text-sm text-gray-700">
                        <p>
                            <div className="font-bold rounded-md p-1 bg-[#ffd9005b shadow-lg border-2 border-[#e1e0d936] mx-1 hover:border-white cursor-pointer">
                                <p className="text-2xl mt-1 text-[#FFF] drop-shadow-lg text-stroke">
                                    <p>{
                                        user?.vendasA > 0 ?
                                            `Jurídico: ${user?.vendasA}` :
                                            `Comercial: ${user?.vendasB}`
                                    }</p>

                                </p>
                            </div>
                        </p>

                    </div>
                </div>
            </Tilt>
        </div>
    );
};

export default FifaCard;
