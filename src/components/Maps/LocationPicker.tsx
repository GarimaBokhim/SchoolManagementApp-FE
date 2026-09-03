"use client";

import { useState } from "react";
import {
    MapContainer,
    Marker,
    TileLayer,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
    latitude?: number;
    longitude?: number;
    onLocationChange: (latitude: number, longitude: number) => void;
}

const markerIcon = new L.Icon({
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function MapClickHandler({
    latitude,
    longitude,
    onLocationChange,
}: LocationPickerProps) {
    const [position, setPosition] = useState<[number, number] | null>(
        latitude !== undefined && longitude !== undefined
            ? [latitude, longitude]
            : null
    );

    useMapEvents({
        click(event) {
            const lat = event.latlng.lat;
            const lng = event.latlng.lng;

            setPosition([lat, lng]);
            onLocationChange(lat, lng);
        },
    });

    if (!position) return null;

    return (
        <Marker
            position={position}
            icon={markerIcon}
            draggable
            eventHandlers={{
                dragend: (event) => {
                    const marker = event.target;
                    const location = marker.getLatLng();

                    setPosition([location.lat, location.lng]);

                    onLocationChange(
                        location.lat,
                        location.lng
                    );
                },
            }}
        />
    );
}

export default function LocationPicker({
    latitude,
    longitude,
    onLocationChange,
}: LocationPickerProps) {
    const defaultPosition: [number, number] = [
        latitude ?? 27.7172,
        longitude ?? 85.324,
    ];

    return (
        <div className="space-y-4">
            <div className="h-[400px] w-full overflow-hidden rounded-lg border">
                <MapContainer
                    center={defaultPosition}
                    zoom={13}
                    scrollWheelZoom
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapClickHandler
                        latitude={latitude}
                        longitude={longitude}
                        onLocationChange={onLocationChange}
                    />
                </MapContainer>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="text-sm font-medium">
                        Latitude
                    </label>

                    <input
                        value={latitude ?? ""}
                        readOnly
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">
                        Longitude
                    </label>

                    <input
                        value={longitude ?? ""}
                        readOnly
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    />
                </div>
            </div>
        </div>
    );
}