'use client';

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import API from "@/lib/api";
import Swal from "sweetalert2";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; 
}

export default function RegisterModal({ isOpen, onClose, onSuccess }: RegisterModalProps) {
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await API.registerLocation(name);
            Swal.fire({
                icon: 'success',
                title: 'Ubicación registrada',
                text: 'La ubicación fue registrada correctamente.',
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                if (onSuccess) onSuccess();  
                onClose();   
            });
            setName("");


        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo registrar la ubicación.',
            });
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                    <Dialog.Title className="text-lg font-bold mb-4">Registrar ubicación</Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Nombre"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                       
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 border rounded"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Registrar
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
