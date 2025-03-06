import React, { useEffect, useState } from 'react';
import UserMap from './Components/UserMap';
import UserLocationTable from './Components/UserLocationTable';
import { getAPI } from '../../../utils/axiosGet';
import IntervalSelector from '../../../UI/IntervalSelector';
import TopCountriesChart from './Components/TopCountriesChart';

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

    const [locationsInterval, setLocationsInterval] = useState<'month' | 'week'>('week');
    const [countriesInterval, setCountriesInterval] = useState<'month' | 'week'>('week');
    const [citiesInterval, setCitiesInterval] = useState<'month' | 'week'>('week');
    const [regionsInterval, setRegionsInterval] = useState<'month' | 'week'>('week');
    const [comparisonInterval, setComparisonInterval] = useState<'month' | 'week'>('week');

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
                    getAPI.get<UserLocation[]>(`/events/behavior/geography/user-locations?web_id=${selectedSite.value}&interval=${locationsInterval}`),
                    getAPI.get<TopCountry[]>(`/events/behavior/geography/top-countries?web_id=${selectedSite.value}`),
                    getAPI.get<TopCity[]>(`/events/behavior/geography/top-cities?web_id=${selectedSite.value}&interval=${citiesInterval}`),
                    getAPI.get<RegionData[]>(`/events/behavior/geography/user-regions?web_id=${selectedSite.value}&interval=${regionsInterval}`),
                    getAPI.get<ComparisonData[]>(`/events/behavior/geography/comparison?web_id=${selectedSite.value}&interval=${comparisonInterval}`),
                ]);

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
    }, [locationsInterval, countriesInterval, citiesInterval, regionsInterval, comparisonInterval]);

    return (
        <div className="geography-page">
            <h1>География пользователей</h1>
            {loading ? (
                <p className="geography-page__loading">Загрузка данных...</p>
            ) : error ? (
                <p className="geography-page__error">{error}</p>
            ) : (
                <div className="geography-content">
                    {/* Карта пользователей */}
                    <div className="geography-section">
                        <h2>Карта пользователей</h2>
                        <IntervalSelector interval={locationsInterval} setInterval={setLocationsInterval} />
                        <UserMap userLocations={userLocations} />
                    </div>

                    {/* Топ стран */}
                    <div className="geography-section">
                        <h2>Топ стран</h2>

                        <TopCountriesChart data={topCountries} />
                    </div>

                    {/* Топ городов */}
                    <div className="geography-section">
                        <h2>Топ городов</h2>
                        <IntervalSelector interval={citiesInterval} setInterval={setCitiesInterval} />
                        {/* <TopCitiesChart data={topCities} /> */}
                    </div>

                    {/* Распределение по регионам */}
                    <div className="geography-section">
                        <h2>Распределение по регионам</h2>
                        <IntervalSelector interval={regionsInterval} setInterval={setRegionsInterval} />
                        {/* <UserLocationTable data={userRegions} /> */}
                    </div>

                    {/* Сравнение по периодам */}
                    <div className="geography-section">
                        <h2>Сравнение по периодам</h2>
                        <IntervalSelector interval={comparisonInterval} setInterval={setComparisonInterval} />
                        {/* <UserLocationTable data={comparisonData} /> */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeographyPage;