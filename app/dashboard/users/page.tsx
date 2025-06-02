"use client";

import React, { useEffect, useState } from "react";
import API from "@/lib/api";
import RegisterModal from "./registerModal";
import UpdateModal from "./updateModal";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";

interface UserForm {
  name: string;
  username: string;
  email: string;
  password?: string;
  user_type?: "User" | "Admin";
  prof_pic?: string;
}

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  age: string;
  gender: string;
  user_type: string;
  prof_pic?: string;
}
const USERS_PER_PAGE = 8;

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchUsers = async () => {
    const data = await API.getUsers();
    setUsers(data);
  };
  const handleDelete = async (email: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Esto eliminará al usuario con email "${email}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await API.deleteUser({ email });
        Swal.fire({
          icon: "success",
          title: "Usuario eliminado",
          text: "El usuario fue eliminado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchUsers();

      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el usuario.",
        });
      }
    }
  };
  useEffect(() => {
    fetchUsers();

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const filteredUsers = users.filter(user => {
    const lowerTerm = term.toLowerCase();
    return (
      user.name?.toLowerCase().includes(lowerTerm) ||
      user.username?.toLowerCase().includes(lowerTerm) ||
      user.email?.toLowerCase().includes(lowerTerm)
    );
  });


  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };


  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-background">
      <div className="flex justify-between items-center mb-6 mt-4">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#e6790c] text-white px-4 py-2 rounded hover:bg-green-700
               dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          + Agregar Usuario
        </button>
      </div>
      <RegisterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={fetchUsers}
      />
      <input
        type="text"
        placeholder="Buscar por nombre, username o email"
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
            <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Foto</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Nombre</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Username</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Sexo</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Edad</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">User Type</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-white dark:bg-gray-900 dark:text-white">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No hay usuarios que mostrar.
              </td>
            </tr>
          ) : (
            paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="border border-gray-300 px-4 py-2">
                  {user.prof_pic ? (
                    <img
                      src={user.prof_pic}
                      alt={`${user.name} perfil`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                      ?
                    </div>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{user.gender}</td>
                <td className="border border-gray-300 px-4 py-2">{user.age}</td>
                <td className="border border-gray-300 px-4 py-2">{user.user_type}</td>
                <td className="border border-gray-300 px-4 py-2 space-x-2 flex">
                  <button
                    onClick={() => openEditModal(user)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
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
        user={selectedUser}
        onSuccess={fetchUsers}
      />
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Anterior
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              currentPage === i + 1 ? "bg-blue-500 text-white dark:bg-blue-600" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

