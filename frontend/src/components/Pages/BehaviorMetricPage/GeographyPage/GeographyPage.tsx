import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserMap from './components/UserMap';
import UserLocationTable from './components/UserLocationTable';

interface UserLocation {
    country: string;
    city: string;
    users: number;
}

const GeographyPage: React.FC = () => {
    const [userLocations, setUserLocations] = useState<UserLocation[]>([]);

    useEffect(() => {
        fetchUserLocations();
    }, []);

    const fetchUserLocations = async () => {
        try {
            const response = await axios.get<UserLocation[]>('/events/geolocation');
            setUserLocations(response.data);
        } catch (error) {
            console.error('Error fetching user locations:', error);
        }
    };

    return (
        <div className="geography-page">
            <h1>География пользователей</h1>
            <div className="geography-content">
                <UserMap userLocations={userLocations} />
                <UserLocationTable userLocations={userLocations} />
            </div>
        </div>
    );
};

export default GeographyPage;