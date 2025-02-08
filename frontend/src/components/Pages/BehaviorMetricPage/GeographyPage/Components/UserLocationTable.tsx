import React from 'react';

interface UserLocation {
    country: string;
    city: string;
    users: number;
}

interface UserLocationTableProps {
    userLocations: UserLocation[];
}

const UserLocationTable: React.FC<UserLocationTableProps> = ({ userLocations }) => {
    return (
        <div className="user-location-table">
            <h2>Распределение пользователей по городам</h2>
            <table>
                <thead>
                    <tr>
                        <th>Страна</th>
                        <th>Город</th>
                        <th>Пользователей</th>
                    </tr>
                </thead>
                <tbody>
                    {userLocations.map((location, index) => (
                        <tr key={index}>
                            <td>{location.country}</td>
                            <td>{location.city}</td>
                            <td>{location.users}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserLocationTable;