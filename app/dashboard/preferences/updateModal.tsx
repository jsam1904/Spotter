'use client';

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import API from "@/lib/api";
import Swal from "sweetalert2";

interface EditPreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  preference: {
    id: string;
    name: string;
  } | null;
  onSuccess?: () => void;
}

export default function UpdateModal({ isOpen, onClose, preference, onSuccess }: EditPreferenceModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (preference) {
      setName(preference.name);
      
    }
  }, [preference]);

  const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!preference) return;

  const safeName = name || preference.name || "Sin nombre";

  try {
    await API.updatePreference(preference.id, {
      name: safeName,

    });

    Swal.fire({
      icon: "success",
      title: "Preferencia actualizada",
      text: "La preferencia fue actualizada correctamente.",
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
      text: "No se pudo actualizar la preferencia.",
    });
  }
};

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
          <Dialog.Title className="text-lg font-bold mb-4">Editar Preferencia</Dialog.Title>

          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              className="w-full p-2 border rounded"
              placeholder="Nombre"
              value={name}
              onChange={e => setName(e.target.value)}
              required
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
