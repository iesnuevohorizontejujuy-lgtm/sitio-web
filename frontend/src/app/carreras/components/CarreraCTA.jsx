"use client";
import { useState } from "react";
import ContactModal from "../components/ContactModal";

/**
 * Client wrapper for the interactive CTA button + modal.
 */
export default function CarreraCTA({ careerId, careerName }) {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <>
            <div className="bg-[#1e2b4d] dark:bg-card dark:border dark:border-border rounded-xl p-6 text-white dark:text-foreground text-center shadow-lg transition-colors duration-300">
                <h3 className="font-bold text-xl mb-2">¿Te interesa esta carrera?</h3>
                <p className="text-white/80 dark:text-muted-foreground text-sm mb-6">
                    Solicita asesoramiento personalizado ahora mismo.
                </p>

                <button
                    onClick={() => setModalOpen(true)}
                    className="block w-full bg-primary py-3 rounded-lg font-bold text-white hover:bg-white hover:text-[#1e2b4d] dark:hover:brightness-110 dark:hover:text-white transition-all shadow-md hover:shadow-lg transform active:scale-95"
                >
                    SOLICITAR INFORMACIÓN
                </button>
            </div>

            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                careerId={careerId}
                careerName={careerName}
            />
        </>
    );
}