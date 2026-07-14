import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-iesnh-cyan selection:text-white flex items-center justify-center px-4 relative overflow-hidden">
            
            {/* Elementos decorativos de fondo para mantener la estética */}
            <div className="absolute top-0 left-0 w-full h-[40vh] bg-iesnh-blue rounded-b-[3rem] shadow-xl z-0" />
            
            <div className="bg-white p-10 md:p-16 rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 text-center border border-gray-100 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                

                {/* Número gigante con color primario */}
                <h1 className="text-8xl md:text-[140px] font-extrabold text-iesnh-blue leading-none tracking-tighter mb-4">
                    404
                </h1>

                {/* Subtítulo y texto */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    ¡Ups! Te saliste del mapa
                </h2>
                
                <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                    La página que intentas visitar no existe, fue movida o tal vez escribiste mal la dirección.
                </p>

                {/* Botones con el mismo estilo del Hero Section */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                    <Link 
                        href="/" 
                        className="bg-iesnh-cyan hover:bg-[#209dc9] text-white font-bold py-3 px-8 rounded-full transition transform hover:-translate-y-1 shadow-lg flex justify-center items-center gap-2 w-full sm:w-auto"
                    >
                        <Home size={20} />
                        VOLVER AL INICIO
                    </Link>
                    
                    <Link 
                        href="/#carreras" 
                        className="bg-transparent border-2 border-iesnh-blue text-iesnh-blue font-bold py-3 px-8 rounded-full hover:bg-iesnh-blue hover:text-white transition w-full sm:w-auto text-center"
                    >
                        VER CARRERAS
                    </Link>
                </div>
            </div>
        </div>
    );
}