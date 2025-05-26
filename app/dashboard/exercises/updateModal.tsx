'use client';

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import API from "@/lib/api";
import Swal from "sweetalert2";
import PreferencesComboBox from "@/components/dashboard/preferencencesComboBox";
interface EditExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    exercise: {
        id: string;
        img: string;
        name: string;
        description: string;
        preference: string;
    } | null;
    onSuccess?: () => void;
}

export default function UpdateModal({ isOpen, onClose, exercise, onSuccess }: EditExerciseModalProps) {
    const [name, setName] = useState("");
    const [img, setImg] = useState("");
    const [description, setDescription] = useState("");
    const [preference, setPreference] = useState("");
    useEffect(() => {
        if (exercise) {
            setName(exercise.name);
            setImg(exercise.img);
            setDescription(exercise.description);
            setPreference(
                Array.isArray(exercise.preference)
                    ? exercise.preference[0] || ""
                    : exercise.preference || ""
            );
        }
    }, [exercise]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!exercise) return;

        try {
            await API.updateExercise(exercise.id, {
                img,
                name,
                description,
                preference
            });
            Swal.fire({
                icon: "success",
                title: "Ejercicio actualizado",
                text: "El ejercicio fue actualizado correctamente.",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                onSuccess?.();
                onClose();
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo actualizar el ejercicio.",
            });
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                    <Dialog.Title className="text-lg font-bold mb-4">Editar Ejercicio</Dialog.Title>

                    <form onSubmit={handleUpdate} className="space-y-4">
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
                        <PreferencesComboBox
                            selectedPreference={preference || ""} 
                            onPreferenceChange={setPreference}
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
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}