import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserMap from './Components/UserMap';
import UserLocationTable from './Components/UserLocationTable';
import { getAPI } from '../../../utils/axiosGet';

interface UserLocation {
    country: string;
    city: string;
    users: number;
}

interface TopCountry {
    country: string;
    users: number;
}

interface TopCity {
    city: string;
    users: number;
}

interface RegionData {
    region: string;
    users: number;
}

interface ComparisonData {
    period: string;
    users: number;
}

const GeographyPage: React.FC = () => {
    const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
    const [topCountries, setTopCountries] = useState<TopCountry[]>([]);
    const [topCities, setTopCities] = useState<TopCity[]>([]);
    const [userRegions, setUserRegions] = useState<RegionData[]>([]);
    const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const selectedSite = JSON.parse(localStorage.getItem('selectedSite') || 'null');
            if (!selectedSite) {
                setError("Сайт не выбран");
                setLoading(false);
                return;
            }

            try {
                const [locations, countries, cities, regions, comparison] = await Promise.all([
                    getAPI.get<UserLocation[]>(`/events/behavior/geography/user-locations?web_id=${selectedSite.value}`),
                    getAPI.get<TopCountry[]>(`/events/behavior/geography/top-countries?web_id=${selectedSite.value}`),
                    getAPI.get<TopCity[]>(`/events/behavior/geography/top-cities?web_id=${selectedSite.value}`),
                    getAPI.get<RegionData[]>(`/events/behavior/geography/user-regions?web_id=${selectedSite.value}`),
                    getAPI.get<ComparisonData[]>(`/events/behavior/geography/comparison?web_id=${selectedSite.value}`),
                ]);
                console.log(locations)
                setUserLocations(locations.data);
                setTopCountries(countries.data);
                setTopCities(cities.data);
                setUserRegions(regions.data);
                setComparisonData(comparison.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="geography-page">
            <h1>География пользователей</h1>
            {loading ? (
                <p className="geography-page__loading">Загрузка данных...</p>
            ) : error ? (
                <p className="geography-page__error">{error}</p>
            ) : (
                <div className="geography-content">
                    <div className="geography-section">
                        <h2>Карта пользователей</h2>
                        <UserMap userLocations={userLocations} />
                    </div>

                    <div className="geography-section">
                        <h2>Топ стран</h2>
                        {/* <TopCountriesChart data={topCountries} /> */}
                    </div>

                    <div className="geography-section">
                        <h2>Топ городов</h2>
                        {/* <TopCitiesChart data={topCities} /> */}
                    </div>

                    <div className="geography-section">
                        <h2>Распределение по регионам</h2>
                        {/* <UserLocationTable data={userRegions} /> */}
                    </div>

                    <div className="geography-section">
                        <h2>Сравнение по периодам</h2>
                        {/* <UserLocationTable data={comparisonData} /> */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeographyPage;