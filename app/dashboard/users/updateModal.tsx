'use client';

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import API from "@/lib/api";
import Swal from "sweetalert2";
import TypesCombobox from "@/components/dashboard/typesCombobox";
import GenderComboBox from "@/components/dashboard/genderComboBox";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    name: string;
    email: string;
    age: string;
    gender: string;
    user_type: string
    bio: string;
    prof_pic: string;
    about_pics: string[]
  } | null;
  onSuccess?: () => void;
}

export default function UpdateModal({ isOpen, onClose, user, onSuccess }: EditUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Masculino");
  const [age, setAge] = useState("");
  const [user_type, setUserType] = useState("User");
  const [bio, setBio] = useState("User");
  const [prof_pic, setProfPic] = useState("User");
  const [about_pics, setAboutPics] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAge(user.age);
      setGender(user.gender);
      setUserType(user.user_type);
      setBio(user.bio);
      setProfPic(user.prof_pic);
      setAboutPics(user.about_pics);
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const safeName = name || user.name || "Sin nombre";
    const safeEmail = email || user.email || "sin@email.com";
    const safeAge = age || user.age || "0";
    const safeGender = gender || user.gender || "No especificado";
    const safeUserType = user_type || user.user_type || "User";
    const safeBio = bio || user.bio || "not Bio";
    const safeProfPic = prof_pic || user.prof_pic || " ";
    const safeAboutPics = Array.isArray(about_pics) && about_pics.length > 0
      ? about_pics
      : Array.isArray(user?.about_pics)
        ? user.about_pics
        : [];

    try {
      await API.updateUser(user.email, {
        name: safeName,
        email: safeEmail,
        gender: safeGender,
        age: safeAge,
        user_type: safeUserType,
        bio: safeBio,
        prof_pic: safeProfPic,
        about_pics: safeAboutPics,
        username: user.username,
        gym: ""
      });

      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        text: "El usuario fue actualizado correctamente.",
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
        text: "No se pudo actualizar el usuario.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
          <Dialog.Title className="text-lg font-bold mb-4">Editar Usuario</Dialog.Title>

          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              className="w-full p-2 border rounded"
              placeholder="Nombre"
              value={name}
              onChange={e => setName(e.target.value)}
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
