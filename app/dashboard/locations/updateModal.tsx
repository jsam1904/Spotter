'use client';

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import API from "@/lib/api";
import Swal from "sweetalert2";

interface EditGymModalProps {
  isOpen: boolean;
  onClose: () => void;
  gym: {
    gymId: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    verified: boolean;
  } | null;
  onSuccess?: () => void;
}

export default function UpdateModal({ isOpen, onClose, gym, onSuccess }: EditGymModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    if (gym) {
      setName(gym.name);
      setDescription(gym.description);
      setLatitude(gym.latitude.toString());
      setLongitude(gym.longitude.toString());
    }
  }, [gym]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gym) return;

    try {
      await API.updateGym(gym.gymId, {
        name,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });

      Swal.fire({
        icon: "success",
        title: "Gimnasio actualizado",
        text: "El gimnasio fue actualizado correctamente.",
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
        text: "No se pudo actualizar el gimnasio.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
          <Dialog.Title className="text-lg font-bold mb-4">Editar Gimnasio</Dialog.Title>

          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              className="w-full p-2 border rounded"
              placeholder="Nombre del gimnasio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Latitud"
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Longitud"
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
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