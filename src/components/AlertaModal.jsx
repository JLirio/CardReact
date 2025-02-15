import { useEffect, useRef  } from "react";

export default function AlertModal({ visible, closeModal }) {
    const audioRef = useRef(null); // Referência para o áudio
    useEffect(() => {
        if (visible) {
            audioRef.current = new Audio(document.getElementById("alert"));
            audioRef.current.loop = true; // Faz o som tocar continuamente até ser parado
            audioRef.current.play();
        } else {
            if (audioRef.current) {
                audioRef.current.pause(); // Pausa o som imediatamente
                audioRef.current.currentTime = 0; // Reseta o áudio para o início
            }
        }
    }, [visible]);

    return (
        
        <div 
            className={visible ? "fixed w-full h-screen flex justify-center items-center z-[9999] blinking-bg" : "hidden"}
            onClick={closeModal} // Fecha ao clicar fora do conteúdo
        >
             <audio id="alert" src="./alarme.mp3" hidden></audio>
             <img src="." alt="" />
            <div 
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
                onClick={(e) => e.stopPropagation()} // Impede que clique dentro feche a modal
            >
                <h1 className="text-2xl font-bold text-red-600">ALERTA!</h1>
                <img src="/danger-alert.gif" alt="Alerta" className="w-48 h-48 my-4" />
                <h3 className="text-base font-bold text-red-600">NÍVEL DE VENDAS BAIXO</h3>
            </div>
        </div>
    );
    
    
}
