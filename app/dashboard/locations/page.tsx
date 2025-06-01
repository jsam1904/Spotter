"use client";

import React, { useEffect, useState } from "react";
import API from "@/lib/api";
import Swal from "sweetalert2";
import RegisterModal from "./registerModal";
import UpdateModal from "./updateModal";
import { Pencil, Trash2, CheckCircle2 } from "lucide-react";

interface Gym {
    gymId: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    verified: boolean;
}

const GYMS_PER_PAGE = 8;

export default function GymsPage() {
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [term, setTerm] = useState('');
    const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchGyms = async () => {
        const data = await API.getGyms();
        setGyms(data);
    };

    const handleDelete = async (gym: Gym) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `Esto eliminará el gimnasio "${gym.name}".`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await API.deleteGym(gym.gymId);
                Swal.fire({
                    icon: "success",
                    title: "Gimnasio eliminado",
                    text: "El gimnasio fue eliminado correctamente.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                fetchGyms();
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo eliminar el gimnasio.",
                });
            }
        }
    };

    useEffect(() => {
        fetchGyms();
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const openEditModal = (gym: Gym) => {
        setSelectedGym(gym);
        setIsEditOpen(true);
    };

    const filteredGyms = gyms.filter(gym => {
        const lowerTerm = term.toLowerCase();
        return (
            gym.name?.toLowerCase().includes(lowerTerm)
        );
    });

    const totalPages = Math.ceil(filteredGyms.length / GYMS_PER_PAGE);
    const indexOfLastGym = currentPage * GYMS_PER_PAGE;
    const indexOfFirstGym = indexOfLastGym - GYMS_PER_PAGE;
    const paginatedGyms = filteredGyms.slice(indexOfFirstGym, indexOfLastGym);

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    return (
        <div className="p-6 max-w-6xl mx-auto bg-background">
            <div className="flex justify-between items-center mb-6 mt-4">
                <h1 className="text-3xl font-bold">Gimnasios</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#e6790c] text-white px-4 py-2 rounded hover:bg-green-700
               dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                    + Agregar Gimnasio
                </button>
                <RegisterModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSuccess={fetchGyms}
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
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Descripción</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Ubicación</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Verificado</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedGyms.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center p-4">
                                No hay gimnasios que mostrar.
                            </td>
                        </tr>
                    ) : (
                        paginatedGyms.map((gym) => (
                            <tr key={gym.gymId} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{gym.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{gym.description}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <span>Lat: {gym.latitude}</span>
                                    <br />
                                    <span>Lng: {gym.longitude}</span>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {gym.verified ? (
                                        <span className="text-green-600 font-bold flex items-center gap-1">
                                            <CheckCircle2 size={18} /> Verificado
                                        </span>
                                    ) : (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await API.verifyGym(gym.gymId);
                                                    Swal.fire({
                                                        icon: "success",
                                                        title: "Gimnasio verificado",
                                                        timer: 1500,
                                                        showConfirmButton: false,
                                                    });
                                                    fetchGyms();
                                                } catch {
                                                    Swal.fire({
                                                        icon: "error",
                                                        title: "Error",
                                                        text: "No se pudo verificar el gimnasio.",
                                                    });
                                                }
                                            }}
                                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Verificar
                                        </button>
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => openEditModal(gym)}
                                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(gym)}
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
                gym={selectedGym}
                onSuccess={fetchGyms}
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

