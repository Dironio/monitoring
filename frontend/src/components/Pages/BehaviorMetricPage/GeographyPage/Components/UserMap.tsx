import React, { useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

let DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
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
}

interface UserMapProps {
    userLocations: UserLocation[];
}

const UserMap: React.FC<UserMapProps> = ({ userLocations }) => {
    const cityCoordinates: Record<string, { lat: number; lng: number }> = useMemo(() => ({
        Moscow: { lat: 55.7558, lng: 37.6173 },
        'New York': { lat: 40.7128, lng: -74.006 },
        London: { lat: 51.5074, lng: -0.1278 },
        Berlin: { lat: 52.52, lng: 13.405 },
        Paris: { lat: 48.8566, lng: 2.3522 },
        Tokyo: { lat: 35.6762, lng: 139.6503 },
        Beijing: { lat: 39.9042, lng: 116.4074 },
        Sydney: { lat: -33.8688, lng: 151.2093 },
        Orenburg: { lat: 51.7727, lng: 55.0988 },
        Buzuluk: { lat: 52.7801, lng: 52.2622 },
        Kazan: { lat: 55.8304, lng: 49.0452 },
        Tashkent: { lat: 41.3161, lng: 69.2486 },
        Vladivostok: { lat: 43.1211, lng: 131.9026 },
        Krasnoyarsk: { lat: 56.0149, lng: 92.8671 },
        Kyiv: { lat: 50.4501, lng: 30.5234 },
        Lviv: { lat: 49.8383, lng: 24.0232 },
        Minsk: { lat: 53.9045, lng: 27.5612 },
        Novosibirsk: { lat: 55.0415, lng: 82.9346 },
        Samara: { lat: 53.1833, lng: 50.0617 },
        Ufa: { lat: 54.7375, lng: 55.9857 },
        Ulyanovsk: { lat: 54.3280, lng: 48.3859 },
        Samarkand: { lat: 45.0988, lng: 65.2361 },
        Yekaterinburg: { lat: 56.8378, lng: 60.5963 },
        NizhnyNovgorod: { lat: 56.2961, lng: 44.0058 },
        Belgorod: { lat: 50.6077, lng: 36.5886 },
        Vladimir: { lat: 56.1324, lng: 40.335 },
        Kirov: { lat: 50.0500, lng: 30.3167 },
        
    }), []);

    const validLocations = useMemo(() => (
        userLocations.filter(location => cityCoordinates[location.city] !== undefined)
    ), [userLocations, cityCoordinates]);

    const center = useMemo(() => {
        if (validLocations.length === 0) {
            return { lat: 55.7558, lng: 37.6173 };
        }

        const total = validLocations.reduce((acc, location) => {
            const coords = cityCoordinates[location.city];
            return { lat: acc.lat + coords.lat, lng: acc.lng + coords.lng };
        }, { lat: 0, lng: 0 });

        return {
            lat: total.lat / validLocations.length,
            lng: total.lng / validLocations.length,
        };
    }, [validLocations, cityCoordinates]);

    const renderMarkers = useCallback(() => {
        return validLocations.map((location, index) => {
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
        });
    }, [validLocations, cityCoordinates]);

    return (
        <MapContainer
            center={center}
            zoom={3}
            style={{ height: "500px", width: "100%" }}
            scrollWheelZoom={true}
            zoomControl={true}
            doubleClickZoom={true}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {renderMarkers()}
        </MapContainer>
    );
};

export default UserMap;
