'use client';

import { Dialog } from "@headlessui/react";
import TypesCombobox from "@/components/dashboard/typesCombobox";
import { useState } from "react";
import API from "@/lib/api";
import Swal from "sweetalert2";
import GenderComboBox from "@/components/dashboard/genderComboBox";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; 
}

export default function RegisterModal({ isOpen, onClose, onSuccess }: RegisterModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("Masculino");
    const [age, setAge] = useState("");
    const [user_type, setUserType] = useState("User");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await API.registerUser({ name, username, password, email, gender, age, user_type });

            Swal.fire({
                icon: 'success',
                title: 'Usuario registrado',
                text: 'El usuario fue registrado correctamente.',
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                if (onSuccess) onSuccess();  
                onClose();   
            });
            setName("");
            setEmail("");
            setUserName("");
            setPassword("");
            setAge("");
            setGender("Masculino");
            setUserType("User")

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo registrar el usuario.',
            });
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                    <Dialog.Title className="text-lg font-bold mb-4">Registrar Usuario</Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Nombre"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUserName(e.target.value)}
                            required
                        />
                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Edad"
                            type="age"
                            value={age}
                            onChange={e => setAge(e.target.value)}
                            required
                        />
                        <TypesCombobox selectedRole={user_type} onRoleChange={setUserType} />
                        <GenderComboBox selectedRole={gender} onRoleChange={setGender} />

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
