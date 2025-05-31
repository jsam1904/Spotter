"use client";

import React, { useEffect, useState } from "react";
import API from "@/lib/api";
import Swal from "sweetalert2";
import RegisterModal from "./registerModal";
import UpdateModal from "./updateModal";
import { Pencil, Trash2 } from "lucide-react";
interface Exercise {
    id: string;
    img: string;
    name: string;
    description: string;
    preference: string;
}

const EXERCISES_PER_PAGE = 8;

export default function UsersPage() {
    const [exercise, setExercise] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [term, setTerm] = useState('');
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchExercises = async () => {
        const data = await API.getExercises();
        setExercise(data);
    };
    const handleDelete = async (exercise: any) => {
        console.log("location a eliminar:", exercise);
        const result = await Swal.fire({

            title: "¿Estás seguro?",
            text: `Esto eliminará la ubicación "${exercise.name}".`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await API.deleteExercise(exercise.id);
                Swal.fire({
                    icon: "success",
                    title: "Ubicación eliminada",
                    text: "La ubicación fue eliminada correctamente.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                fetchExercises();
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
        fetchExercises();

        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const openEditModal = (exercise: Exercise) => {
        setSelectedExercise(exercise);
        setIsEditOpen(true);
    };

    const filteredExercise = exercise.filter(exercise => {
        const lowerTerm = term.toLowerCase();
        const prefString = Array.isArray(exercise.preference)
            ? exercise.preference.join(", ")
            : (exercise.preference ?? "");
        return (
            exercise.name?.toLowerCase().includes(lowerTerm) ||
            prefString.toLowerCase().includes(lowerTerm)
        );
    });


    const totalPages = Math.ceil(filteredExercise.length / EXERCISES_PER_PAGE);
    const indexOfLastUser = currentPage * EXERCISES_PER_PAGE;
    const indexOfFirstUser = indexOfLastUser - EXERCISES_PER_PAGE;
    const paginatedUsers = filteredExercise.slice(indexOfFirstUser, indexOfLastUser);

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    return (
        <div className="p-6 max-w-6xl mx-auto bg-background">
            <div className="flex justify-between items-center mb-6 mt-4">
                <h1 className="text-3xl font-bold">Ejercicios</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#e6790c] text-white px-4 py-2 rounded hover:bg-green-700
               dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                    + Agregar Ejercicio
                </button>
                <RegisterModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSuccess={fetchExercises}
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
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Imagen</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Nombre</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Descripción</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Prefencia vinculada</th>
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
                        paginatedUsers.map((exercise) => (
                            <tr key={exercise.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">
                                    {exercise.img ? (
                                        <img
                                            src={exercise.img}
                                            alt={exercise.name}
                                            className="w-16 h-16 object-cover rounded-md border"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md text-gray-400">
                                            Sin imagen
                                        </div>
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{exercise.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{exercise.description}</td>
                                <td className="border border-gray-300 px-4 py-2">{exercise.preference}</td>
                                <td className="border border-gray-300 px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => openEditModal(exercise)}
                                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        title="Editar"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exercise)}
                                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={15} />
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
                exercise={selectedExercise}
                onSuccess={fetchExercises}
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

