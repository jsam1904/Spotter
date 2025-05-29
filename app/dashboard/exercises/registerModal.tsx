'use client';

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import API from "@/lib/api";
import Swal from "sweetalert2";
import PreferencesComboBox from "@/components/dashboard/preferencencesComboBox";
interface RegisterExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; 
}
export default function RegisterModal({ isOpen, onClose, onSuccess }: RegisterExerciseModalProps) {
    const [name, setName] = useState("");
    const [img, setImg] = useState("");
    const [description, setDescription] = useState("");
    const [preference, setPreference] = useState("");
    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
    
            try {
            await API.registerExercise({ img, name, description, preference });
                Swal.fire({
                    icon: 'success',
                    title: 'Ejercicio registrado y vinculado a ' + preference,
                    text: 'El ejercicio fue registrado correctamente.',
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
                    text: 'No se pudo registrar el ejercicio.',
                });
            }
        };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                    <Dialog.Title className="text-lg font-bold mb-4">Registrar Ejercicio</Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            className="w-full p-2 border rounded"
                            placeholder="URL de imagen"
                            value={img}
                            onChange={(e) => setImg(e.target.value)}
                            required
                        />
                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Nombre del ejercicio"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <textarea
                            className="w-full min-h-[250px] max-h-40 p-2 border rounded resize-none overflow-auto"
                            placeholder="Descripción del ejercicio"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <PreferencesComboBox selectedPreference={preference} onPreferenceChange={setPreference} />


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