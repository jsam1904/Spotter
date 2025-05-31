"use client";

import React, { useEffect, useState } from "react";
import API from "@/lib/api";
import Swal from "sweetalert2";
import RegisterModal from "./registerModal";
import UpdateModal from "./updateModal";
import { Pencil, Trash2 } from "lucide-react";

interface Location {
    id: string;
    name: string;
}

const USERS_PER_PAGE = 8;

export default function UsersPage() {
    const [location, setLocation] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [term, setTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchLocations = async () => {
        const data = await API.getLocations();
        setLocation(data);
    };
    const handleDelete = async (location: any) => {
        console.log("location a eliminar:", location);
        const result = await Swal.fire({

            title: "¿Estás seguro?",
            text: `Esto eliminará la ubicación "${location.name}".`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await API.deleteLocation(location.id);
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

    const openEditModal = (location: Location) => {
        setSelectedLocation(location);
        setIsEditOpen(true);
    };

    const filteredLocation = location.filter(location => {
        const lowerTerm = term.toLowerCase();
        return (
            location.name?.toLowerCase().includes(lowerTerm)
        );
    });


    const totalPages = Math.ceil(filteredLocation.length / USERS_PER_PAGE);
    const indexOfLastUser = currentPage * USERS_PER_PAGE;
    const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
    const paginatedUsers = filteredLocation.slice(indexOfFirstUser, indexOfLastUser);

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    return (
        <div className="p-6 max-w-6xl mx-auto bg-background">
            <div className="flex justify-between items-center mb-6 mt-4">
                <h1 className="text-3xl font-bold">Ubicaciones</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#e6790c] text-white px-4 py-2 rounded hover:bg-green-700
               dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                    + Agregar Ubicación
                </button>
                <RegisterModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSuccess={fetchLocations}
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
                                No hay ubicaciones que mostrar.
                            </td>
                        </tr>
                    ) : (
                        paginatedUsers.map((location) => (
                            <tr key={location.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{location.name}</td>
                                <td className="border border-gray-300 px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => openEditModal(location)}
                                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(location)}
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
                location={selectedLocation}
                onSuccess={fetchLocations}
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

