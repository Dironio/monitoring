import React, { useState, useEffect } from "react";
import './SiteSelection.css';
import Select from "react-select";

const SiteSelection: React.FC<{ role: number; userId: number }> = ({ role, userId }) => {
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null);
    const [platforms, setPlatforms] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState(null);



    const fetchAvailableSites = async () => {
        try {
            const response = await axios.get("/api/sites");
            setSites(response.data); // Данные обрабатываются в бэке согласно логике ролей
        } catch (error) {
            console.error("Ошибка загрузки сайтов", error);
        }
    };

    const fetchAvailablePlatforms = async () => {
        try {
            const response = await axios.get("/api/platforms"); // Например, список пользователей других платформ
            setPlatforms(response.data);
        } catch (error) {
            console.error("Ошибка загрузки платформ", error);
        }
    };

    const handleSiteChange = (selectedOption: any) => {
        setSelectedSite(selectedOption);
    };

    const handlePlatformChange = (selectedOption: any) => {
        setSelectedPlatform(selectedOption);
    };


    useEffect(() => {
        // Запрос сайтов
        fetchAvailableSites();
        // Запрос платформ
        fetchAvailablePlatforms();
    }, []);

    return (
        <div>
            {role > 1 && ( // Если роль больше 1, показываем выбор сайта или платформы
                <div className="choose-site">
                    <img src="poloski.svg" alt="" className="choose-site__img" />
                    <p className="choose-site__title">
                        {selectedSite ? selectedSite.label : "Не выбрано или Демо-режим"}
                    </p>

                    {/* Выпадающий список сайтов */}
                    <Select
                        options={sites.map((site) => ({ value: site.id, label: site.name }))}
                        onChange={handleSiteChange}
                        className="custom-select"
                    />
                </div>
            )}
            {role > 2 && (
                <div className="choose-platform">
                    <p>Выбор платформы пользователей:</p>
                    <Select
                        options={platforms.map((platform) => ({ value: platform.id, label: platform.name }))}
                        onChange={handlePlatformChange}
                        className="custom-select"
                    />
                </div>
            )}
        </div>
    );
};

export default SiteSelection;
