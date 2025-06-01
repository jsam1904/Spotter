'use client';

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import API from "@/lib/api";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import L, { LatLngExpression } from "leaflet";
import { useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Icono naranja para gimnasios
const orangeIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48"><path fill="#e6790c" stroke="#fff" stroke-width="3" d="M16 2C8.268 2 2 8.268 2 16c0 10.493 12.07 28.01 12.595 28.77a2 2 0 0 0 3.21 0C17.93 44.01 30 26.493 30 16c0-7.732-6.268-14-14-14zm0 20a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/></svg>`),
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});

// Dynamic imports for react-leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; 
}

export default function RegisterModal({ isOpen, onClose, onSuccess }: RegisterModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");
    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);

    // Handler para seleccionar ubicación en el mapa
    function LocationSelector() {
        useMapEvents({
            click(e) {
                setMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
                setLatitude(e.latlng.lat.toString());
                setLongitude(e.latlng.lng.toString());
            },
        });
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!latitude || !longitude) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecciona una ubicación en el mapa',
            });
            return;
        }

        try {
            await API.suggestGym({
                name,
                description,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            });
            Swal.fire({
                icon: 'success',
                title: 'Gimnasio registrado',
                text: 'El gimnasio fue registrado correctamente.',
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                if (onSuccess) onSuccess();  
                onClose();   
            });
            setName("");
            setDescription("");
            setLatitude("");
            setLongitude("");
            setMarker(null);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo registrar el gimnasio.',
            });
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                    <Dialog.Title className="text-lg font-bold mb-4">Registrar Gimnasio</Dialog.Title>

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
                            placeholder="Descripción"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                        <div>
                            <label className="block text-sm font-semibold mb-1">Ubicación</label>
                            <div className="w-full h-64 rounded-lg overflow-hidden mb-2 z-0 relative">
                                {typeof window !== "undefined" && (
                                    <MapContainer
                                        center={[14.634915, -90.506882] as LatLngExpression}
                                        zoom={12}
                                        style={{ height: "100%", width: "100%" }}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <LocationSelector />
                                        {marker && (
                                            <Marker
                                                position={[marker.lat, marker.lng]}
                                                icon={orangeIcon}
                                            >
                                                <Popup>Ubicación seleccionada</Popup>
                                            </Marker>
                                        )}
                                    </MapContainer>
                                )}
                            </div>
                            {marker ? (
                                <div className="text-xs text-green-700 dark:text-green-400">
                                    Coordenadas seleccionadas: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                                </div>
                            ) : (
                                <div className="text-xs text-rose-700 dark:text-rose-400">
                                    Haz clic en el mapa para seleccionar la ubicación del gimnasio.
                                </div>
                            )}
                        </div>
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
