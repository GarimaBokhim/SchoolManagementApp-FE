"use client";

import { useState } from "react";

interface LocationPickerProps {
    latitude?: number;
    longitude?: number;
    onLocationChange: (latitude: number, longitude: number) => void;
}

function parseCoordinates(value: string) {
    const parts = value.split(",");
    if (parts.length !== 2 || parts.some((part) => !part.trim())) return null;

    const latitude = Number(parts[0].trim());
    const longitude = Number(parts[1].trim());

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {
        return null;
    }

    return { latitude, longitude };
}

export default function LocationPicker({
    latitude,
    longitude,
    onLocationChange,
}: LocationPickerProps) {
    const [coordinateText, setCoordinateText] = useState("");
    const [hasInvalidCoordinates, setHasInvalidCoordinates] = useState(false);

    const mapLatitude = latitude && latitude !== 0 ? latitude : 27.7172;
    const mapLongitude = longitude && longitude !== 0 ? longitude : 85.324;
    const googleMapsUrl = `https://www.google.com/maps/@${mapLatitude},${mapLongitude},16z`;

    const handleCoordinateChange = (value: string) => {
        setCoordinateText(value);
        const coordinates = parseCoordinates(value);
        setHasInvalidCoordinates(value.trim().length > 0 && !coordinates);

        if (coordinates) {
            onLocationChange(coordinates.latitude, coordinates.longitude);
        }
    };

    return (
        <div className="space-y-4">
            <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
                Choose location on Google Maps
            </a>

            <p className="text-sm text-gray-600">
                In Google Maps, click the location and copy the coordinates shown in its location card.
                Paste them below as latitude, longitude.
            </p>

            <div>
                <label htmlFor="google-maps-coordinates" className="text-sm font-medium">
                    Paste coordinates from Google Maps
                </label>
                <input
                    id="google-maps-coordinates"
                    value={coordinateText}
                    onChange={(event) => handleCoordinateChange(event.target.value)}
                    placeholder="27.7407087, 85.361561"
                    aria-invalid={hasInvalidCoordinates}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                />
                {hasInvalidCoordinates && (
                    <p role="alert" className="mt-1 text-sm text-red-600">
                        Enter valid coordinates in latitude, longitude order.
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="text-sm font-medium">Latitude</label>
                    <input
                        value={latitude ?? ""}
                        readOnly
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Longitude</label>
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
