import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

let DefaultIcon = L.icon({
    // iconUrl: icon,
    // shadowUrl: iconShadow,
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

    const cityCoordinates: Record<string, { lat: number; lng: number }> = {
        Moscow: { lat: 55.7558, lng: 37.6173 },
        'New York': { lat: 40.7128, lng: -74.006 },
        London: { lat: 51.5074, lng: -0.1278 },
        Berlin: { lat: 52.52, lng: 13.405 },
    };

    return (
        <MapContainer //center={[55.7558, 37.6173]} zoom={3} style={{ height: '500px', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {userLocations.map((location, index) => {
                const coordinates = cityCoordinates[location.city];
                if (!coordinates) return null;

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
        // <div className=""></div>
    );
};

export default UserMap;