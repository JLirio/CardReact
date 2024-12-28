import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
            <div className="relative bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-xl shadow-md p-4 w-52 text-center">
                {/* Rating */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black font-bold text-lg rounded-full w-12 h-12 flex items-center justify-center">
                    {user?.group}
                </div>
                {/* Club and Position */}
                <div className="mt-6">
                    <img
                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAbEP9_UogxxGxImR5hlQcg5fR73yIFlH3U0uBv3yGVeLFUJGrOb-glHEfy04&s=10"}
                        alt="Club Logo"
                        className="w-10 h-10 mx-auto rounded-full"
                    />
                    <p className="text-sm font-semibold text-gray-800">{user?.cargo}</p>
                </div>
                {/* Player Image and Name */}
                <div className="mt-4">
                    <img
                        src={"https://avatars.fastly.steamstatic.com/187e0bfa1b19f96b54be6bf83c808685f36e85e1_full.jpg"}
                        alt={`'s Country Flag`}
                        className="w-20 h-20 mx-auto rounded-full border-2 border-white"
                    />
                    <h3 className="mt-2 text-md font-bold text-gray-900">{user?.name}</h3>
                </div>
                {/* Stats */}
                <div className="mt-4 text-sm text-gray-700">
                    <p>
                        <span className="font-bold">TOTAIS</span> {user?.vendasTotais}
                    </p>
                    <p>
                        <span className="font-bold">JURI</span> {user?.vendasA}
                    </p>
                    <p>
                        <span className="font-bold">COME</span> {user?.vendasB}
                    </p>

                </div>
            </div>
        </div>
    );
};

export default FifaCard;
