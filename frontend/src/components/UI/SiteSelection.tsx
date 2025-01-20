import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import './SiteSelection.css';
import { WebSite } from "../../models/site.model";
import { User } from "../../models/user.model";

interface SiteSelectionProps {
    user: User | null;
    loading: boolean;
    onSiteChange?: (site: { value: number; label: string } | null) => void;
}

export interface SiteSelection {
    value: number;
    label: string;
}

const SiteSelection: React.FC<SiteSelectionProps> = ({ user, loading, onSiteChange }) => {
    const [sites, setSites] = useState<WebSite[]>([]);
    const selectRef = useRef<any>(null);
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

            if (user.role_id === 1) {
                const demoSite = response.data.find(site => site.id === 1);
                if (demoSite) {
                    handleSiteChange({
                        value: demoSite.id,
                        label: demoSite.site
                    });
                }
            }
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
        if (onSiteChange) {
            onSiteChange(selectedOption); // Добавляем вызов
        }
        if (selectedOption) {
            localStorage.setItem('selectedSite', JSON.stringify(selectedOption));
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


    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectRef.current) {
            selectRef.current.onMenuOpen();
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (!user) return null;

    return (
        <section className="site-selection">
            <div className="site-selection__select-container">
                <div className="site-selection__select">
                    <img
                        src="/assets/burger.svg"
                        alt=""
                        className="site-selection__icon"
                        onClick={handleIconClick}
                    />
                    <Select
                        value={selectedSite}
                        options={sites.map((site) => ({
                            value: site.id,
                            label: site.site,
                        }))}
                        onChange={handleSiteChange}
                        className={`custom-select ${user.role_id === 1 ? 'site-selection__select--demo' : ''}`}
                        isDisabled={user.role_id === 1}
                        isSearchable={true}
                        placeholder=""
                        menuPlacement="auto"
                    />
                </div>
            </div>
        </section>
    )
};


export default SiteSelection;