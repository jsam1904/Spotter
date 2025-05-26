"use client";

import React, { useEffect, useState } from "react";
import API from "@/lib/api";
import Swal from "sweetalert2";
import RegisterModal from "./registerModal";
const USERS_PER_PAGE = 8;

export default function UsersPage() {
    const [location, setLocation] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [term, setTerm] = useState('');
    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchLocations = async () => {
        const data = await API.getLocations();
        setLocation(data);
    };
    const handleDelete = async (location: any) => {
        console.log("location a eliminar:", location); // <-- agrega esto
        const result = await Swal.fire({
            
            title: "¿Estás seguro?",
            text: `Esto eliminará la ubicación "${location.name}".`, // muestra el nombre
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await API.deleteLocation(location.id); // usa el id para el backend
                Swal.fire({
                    icon: "success",
                    title: "Ubicación eliminada",
                    text: "La ubicación fue eliminada correctamente.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                fetchLocations();
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo eliminar la ubicación.",
                });
            }
        }
    };
    useEffect(() => {
        fetchLocations();

        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    // Filtrar + paginar usuarios
    const filteredPreferences = location.filter(location => {
        const lowerTerm = term.toLowerCase();
        return (
            location.name?.toLowerCase().includes(lowerTerm)
        );
    });


    const totalPages = Math.ceil(filteredPreferences.length / USERS_PER_PAGE);
    const indexOfLastUser = currentPage * USERS_PER_PAGE;
    const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
    const paginatedUsers = filteredPreferences.slice(indexOfFirstUser, indexOfLastUser);

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    return (
        <div className="p-6 max-w-6xl mx-auto bg-background">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Preferencias</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#e6790c] text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Agregar Usuario
                </button>
                <RegisterModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSuccess={fetchLocations}
                />
            </div>

            <input
                type="text"
                placeholder="Buscar por nombre, username o email"
                value={term}
                onChange={(e) => {
                    setTerm(e.target.value);
                    setCurrentPage(1);
                }}
                className="mb-4 px-4 py-2 border rounded w-full md:w-1/2"
            />

            <table className="min-w-full border border-gray-300 border-collapse">
                <thead>
                    <tr className={`${isDarkMode ? "bg-[#01152b]" : "bg-white"}`}>
                        <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center p-4">
                                No hay ubicaciones que mostrar.
                            </td>
                        </tr>
                    ) : (
                        paginatedUsers.map((location) => (
                            <tr key={location.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{location.name}</td>
                                <td className="border border-gray-300 px-4 py-2 space-x-2">
                                    <button

                                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => handleDelete(location)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

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

