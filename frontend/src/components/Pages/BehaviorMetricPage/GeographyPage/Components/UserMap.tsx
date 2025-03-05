import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Установка иконки для маркеров
let DefaultIcon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface UserLocation {
    country: string;
    city: string;
    users: number;
    lat?: number;
    lng?: number;
}

interface UserMapProps {
    userLocations: UserLocation[];
}

const UserMap: React.FC<UserMapProps> = ({ userLocations }) => {
    // Координаты для городов
    const cityCoordinates: Record<string, { lat: number; lng: number }> = {
        Moscow: { lat: 55.7558, lng: 37.6173 },
        'New York': { lat: 40.7128, lng: -74.006 },
        London: { lat: 51.5074, lng: -0.1278 },
        Berlin: { lat: 52.52, lng: 13.405 },
        // Добавьте другие города по мере необходимости
    };

    // Отфильтровать локации с известными координатами
    const validLocations = userLocations.filter(location => cityCoordinates[location.city]);

    // Центр карты (среднее значение координат)
    const center = validLocations.length > 0
        ? validLocations.reduce((acc, location) => {
            const coords = cityCoordinates[location.city];
            return { lat: acc.lat + coords.lat, lng: acc.lng + coords.lng };
        }, { lat: 0, lng: 0 })
        : { lat: 55.7558, lng: 37.6173 }; // Москва по умолчанию

    if (validLocations.length > 0) {
        center.lat /= validLocations.length;
        center.lng /= validLocations.length;
    }

    return (
        <MapContainer center={center} zoom={3} style={{ height: "500px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {validLocations.map((location, index) => {
                const coordinates = cityCoordinates[location.city];
                return (
                    <Marker key={index} position={[coordinates.lat, coordinates.lng]}>
                        <Popup>
                            <strong>{location.city}, {location.country}</strong>
                            <br />
                            Пользователей: {location.users}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default UserMap;
