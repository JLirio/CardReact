import { useEffect, useRef } from "react";

export default function AlertModal({ visible, closeModal }) {
    const audioRef = useRef(null); // Referência para o áudio

    useEffect(() => {
        const audio = audioRef.current;
        
        if (audio) {
            const playAudio = () => {
                audio.loop = true; // Faz o som tocar continuamente
                audio.play().catch((error) => {
                    console.error("Erro ao reproduzir música:", error);
                });
            };

            // Garantindo que o áudio carregou antes de tocar
            if (visible) {
                if (audio.readyState >= 2) {
                    playAudio();
                } else {
                    audio.oncanplaythrough = playAudio;
                }
            } else {
                audio.pause();
                audio.currentTime = 0; // Reseta o áudio para o início
            }
        }
    }, [visible]);

    return (
        <>
            {/* Áudio com suporte a múltiplos formatos */}
            <audio ref={audioRef} id="alert">
                <source src="/alarme.mp3" type="audio/mpeg" />
                <source src="/alarme.ogg" type="audio/ogg" />
                Seu navegador não suporta áudio.
            </audio>

            {/* Modal de Alerta */}
            <div
                className={visible ? "fixed w-full h-screen flex justify-center items-center z-[9999] blinking-bg" : "hidden"}
                onClick={closeModal} // Fecha ao clicar fora do conteúdo
            >
                <div
                    className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()} // Impede que clique dentro feche a modal
                >
                    <h1 className="text-2xl font-bold text-red-600">ALERTA!</h1>
                    <img src="/danger-alert.gif" alt="Alerta" className="w-48 h-48 my-4" />
                    <h3 className="text-base font-bold text-red-600">NÍVEL DE VENDAS BAIXO</h3>
                </div>
            </div>
        </>
    );
}
