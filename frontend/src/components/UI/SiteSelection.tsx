import React, { useState, useEffect } from "react";
import axios from "axios"; // Убедитесь, что axios установлен
import Select from "react-select";
import './SiteSelection.css';
import { WebSite } from "../../models/site.model"; // Ваши модели
import { User } from "../../models/user.model"; // Модель пользователя

interface SiteSelectionProps {
    user: User | null;
    loading: boolean;
}

const SiteSelection: React.FC<SiteSelectionProps> = ({ user, loading }) => {
    const [sites, setSites] = useState<WebSite[]>([]);
    const [selectedSite, setSelectedSite] = useState<{ value: number; label: string } | null>(() => {
        const savedSite = localStorage.getItem('selectedSite');
        return savedSite ? JSON.parse(savedSite) : null;
    });
    const [platforms, setPlatforms] = useState<{ value: number; label: string }[]>([]);
    const [selectedPlatform, setSelectedPlatform] = useState<{ value: number; label: string } | null>(null);

    const fetchAvailableSites = async () => {
        if (!user) return;
        try {
            const response = await axios.get<WebSite[]>(`${process.env.REACT_APP_API_URL}/sites`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setSites(response.data);
        } catch (error) {
            console.error("Ошибка загрузки сайтов", error);
        }
    };

    const fetchAvailablePlatforms = async () => {
        try {
            const response = await axios.get<{ id: number; name: string }[]>(`${process.env.REACT_APP_API_URL}/sites/web`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setPlatforms(response.data.map(platform => ({ value: platform.id, label: platform.name })));
        } catch (error) {
            console.error("Ошибка загрузки платформ", error);
        }
    };

    const handleSiteChange = (selectedOption: { value: number; label: string } | null) => {
        setSelectedSite(selectedOption);
        if (selectedOption) {
            localStorage.setItem('selectedSite', JSON.stringify(selectedOption));
        } else {
            localStorage.removeItem('selectedSite');
        }
        console.log("Выбранный сайт:", selectedOption);
    };

    const handlePlatformChange = (selectedOption: { value: number; label: string } | null) => {
        setSelectedPlatform(selectedOption);
        console.log("Выбранная платформа:", selectedOption);
    };

    useEffect(() => {
        fetchAvailableSites();
        fetchAvailablePlatforms();
    }, []);

    if (!user) {
        return <p>Ошибка: пользователь не найден.</p>;
    }

    return (
        <div>
            {/* Проверяем роль пользователя */}
            {user.role_id && user.role_id > 1 && (
                <div className="choose-site">
                    <img src="poloski.svg" alt="" className="choose-site__img" />
                    <p className="choose-site__title">
                        {selectedSite ? selectedSite.label : "Не выбрано или Демо-режим"}
                    </p>

                    {/* Выпадающий список сайтов */}
                    <Select
                        options={sites.map((site) => ({
                            value: site.id,
                            label: site.site,
                        }))}
                        onChange={handleSiteChange}
                        className="custom-select"
                    />
                </div>
            )}
            {/* {user.role_id && user.role_id > 2 && (
                <div className="choose-platform">
                    <p>Выбор платформы пользователей:</p>
                    <Select
                        options={platforms}
                        onChange={handlePlatformChange}
                        className="custom-select"
                    />
                </div>
            )} */}
        </div>
    );
};

export default SiteSelection;