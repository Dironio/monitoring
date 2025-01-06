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

    const fetchAvailableSites = async () => {
        if (!user) return;

        try {
            const response = await axios.get<WebSite[]>(`${process.env.REACT_APP_API_URL}/sites/web`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            setSites(response.data);

            // Для роли 1 автоматически выбираем демо-сайт (id=1)
            if (user.role_id === 1) {
                const demoSite = response.data.find(site => site.id === 1);
                if (demoSite) {
                    handleSiteChange({
                        value: demoSite.id,
                        label: demoSite.site
                    });
                }
            }
            // Для других ролей, если нет выбранного сайта, устанавливаем демо-сайт
            else if (!selectedSite && response.data.length > 0) {
                const demoSite = response.data.find(site => site.id === 1);
                if (demoSite) {
                    handleSiteChange({
                        value: demoSite.id,
                        label: demoSite.site
                    });
                }
            }
        } catch (error) {
            console.error("Ошибка загрузки сайтов", error);
        }
    };

    const handleSiteChange = (selectedOption: { value: number; label: string } | null) => {
        setSelectedSite(selectedOption);
        if (selectedOption) {
            localStorage.setItem('selectedSite', JSON.stringify(selectedOption));
            // Dispatch событие изменения сайта
            const event = new CustomEvent('siteSelected', {
                detail: {
                    siteId: selectedOption.value,
                    isDemo: selectedOption.value === 1
                }
            });
            window.dispatchEvent(event);
        }
    };

    useEffect(() => {
        fetchAvailableSites();
    }, [user]);

    if (loading) return <div>Загрузка...</div>;
    if (!user) return null;

    return (
        <div className="site-selection">
            <div className="site-selection__card">
                <div className="site-selection__header">
                    <h2 className="site-selection__title">Выбор сайта</h2>
                    <p className="site-selection__description">
                        {user.role_id === 1
                            ? "Доступен только демо-режим"
                            : "Выберите сайт для анализа"
                        }
                    </p>
                </div>
                <div className="site-selection__content">
                    <div className="site-selection__select-container">
                        {/* <img
                            src="poloski.svg"
                            alt=""
                            className="site-selection__icon"
                        /> */}
                        <div className="site-selection__select">
                            <p className="site-selection__current">
                                {selectedSite ? selectedSite.label : "Не выбрано или Демо-режим"}
                            </p>
                            <Select
                                value={selectedSite}
                                options={sites.map((site) => ({
                                    value: site.id,
                                    label: site.site,
                                }))}
                                onChange={handleSiteChange}
                                className={`custom-select ${user.role_id === 1 ? 'site-selection__select--demo' : ''}`}
                                isDisabled={user.role_id === 1}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default SiteSelection;