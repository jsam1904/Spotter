"use client";

import React, { useEffect, useState } from "react";
import API from "@/lib/api";
import Swal from "sweetalert2";
import RegisterModal from "./registerModal";
import UpdateModal from "./updateModal";
import { Pencil, Trash2 } from "lucide-react";

interface Preference {
    id: string;
    name: string;
}

const PREFERENCES_PER_PAGE = 8;

export default function PreferencesPage() {
    const [preferences, setPreference] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [term, setTerm] = useState('');
    const [selectedPreference, setSelectedPreference] = useState<Preference | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchPreferences = async () => {
        const data = await API.getPreferences();
        setPreference(data);
    };
    const handleDelete = async (preference: any) => {
        console.log(preference);
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `Esto eliminará la preferencia "${preference.name}".`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await API.deletePreference(preference.id);
                Swal.fire({
                    icon: "success",
                    title: "Preferencia eliminada",
                    text: "La preferencia fue eliminada correctamente.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                fetchPreferences();
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo eliminar la preferencia.",
                });
            }
        }
    };
    useEffect(() => {
        fetchPreferences();

        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);
    const openEditModal = (preference: Preference) => {
        setSelectedPreference(preference);
        setIsEditOpen(true);
    };

    const filteredPreferences = preferences.filter(preference => {
        const lowerTerm = term.toLowerCase();
        return (
            preference.name?.toLowerCase().includes(lowerTerm)
        );
    });


    const totalPages = Math.ceil(filteredPreferences.length / PREFERENCES_PER_PAGE);
    const indexOfLastPreference = currentPage * PREFERENCES_PER_PAGE;
    const indexOfFirstPreference = indexOfLastPreference - PREFERENCES_PER_PAGE;
    const paginatedUsers = filteredPreferences.slice(indexOfFirstPreference, indexOfLastPreference);

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    return (
        <div className="p-6 max-w-6xl mx-auto bg-background">
            <div className="flex justify-between items-center mb-6 mt-4">
                <h1 className="text-3xl font-bold">Preferencias</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#e6790c] text-white px-4 py-2 rounded hover:bg-green-700
               dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                    + Agregar Preferencia
                </button>
                <RegisterModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSuccess={fetchPreferences}
                />
            </div>

            <input
                type="text"
                placeholder="Buscar por nombre"
                value={term}
                onChange={(e) => {
                    setTerm(e.target.value);
                    setCurrentPage(1);
                }}
                className="mb-4 px-4 py-2 border rounded w-full md:w-1/2 bg-white text-black placeholder-gray-500 border-gray-300
               dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-700 transition-colors"
            />

            <table className="min-w-full border border-gray-300 border-collapse">
                <thead>
                    <tr className="bg-white dark:bg-gray-900">
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Nombre</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center p-4">
                                No hay preferencias que mostrar.
                            </td>
                        </tr>
                    ) : (
                        paginatedUsers.map((preference) => (
                            <tr key={preference.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{preference.name}</td>
                                <td className="border border-gray-300 px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => openEditModal(preference)}
                                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(preference)}
                                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <UpdateModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                preference={selectedPreference}
                onSuccess={fetchPreferences}
            />
            <div className="flex justify-center mt-4 space-x-2">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Siguiente

                </button>
            </div>
        </div>
    );
}

