import React, { useState, useEffect, useRef } from "react";
import "./SiteSelection.css";
import { User } from "../../models/user.model";
import CustomSelect, { SelectOption } from "./CustomSelect";
import { SiteOption, WebSite } from "../../models/site.model";
import { getAPI } from "../utils/axiosGet";


interface SiteSelectionProps {
    user: User | null;
    loading: boolean;
    onSiteChange?: (site: SiteOption | null) => void;
    disabled?: boolean;
}

const SiteSelection: React.FC<SiteSelectionProps> = ({ user, loading, onSiteChange, disabled }) => {
    const [sites, setSites] = useState<SiteOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedValue, setSelectedValue] = useState<string | number>(() => {
        const savedSite = localStorage.getItem('selectedSite');
        return savedSite ? JSON.parse(savedSite).value : '';
    });
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<any>(null);



    const handleSiteChange = (value: string | number | (string | number)[]) => {
        const processedValue = Array.isArray(value) ? value[0] : value;
        const numericValue = typeof processedValue === 'number' ? processedValue : Number(processedValue);

        setSelectedValue(processedValue);

        if (!processedValue || isNaN(numericValue)) {
            onSiteChange?.(null);
            localStorage.removeItem('selectedSite');
            return;
        }

        const selectedOption = sites.find(site => site.value === numericValue);
        if (selectedOption) {
            const siteOption: SiteOption = {
                value: selectedOption.value,
                label: selectedOption.label
            };
            onSiteChange?.(siteOption);
            localStorage.setItem('selectedSite', JSON.stringify(siteOption));

            window.dispatchEvent(new CustomEvent('siteSelected', {
                detail: {
                    siteId: numericValue,
                    isDemo: numericValue === 1
                }
            }));
        }
    };

    const fetchAvailableSites = async () => {
        if (!user) return;

        try {
            const response = await getAPI.get<WebSite[]>(`/sites/web`);

            const siteOptions = response.data.map(site => ({
                value: site.id,
                label: site.site
            }));
            setSites(siteOptions);

            if ((user.role_id === 1 || !selectedValue) && response.data.length > 0) {
                const demoSite = response.data.find(site => site.id === 1);
                if (demoSite) {
                    handleSiteChange(demoSite.id);
                }
            }
        } catch (error) {
            console.error("Ошибка загрузки сайтов", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectRef.current) {
            selectRef.current.select.onMenuOpen();
            setIsOpen(true);
        }
    };

    useEffect(() => {
        fetchAvailableSites();
    }, []);
    return (
        <div className={`site-select-container ${isOpen ? 'is-open' : ''}`}>
            <div
                className="site-select-icon"
                onClick={handleIconClick}
                role="button"
                tabIndex={0}
            >
                <img
                    src="/assets/burger.svg"
                    alt="Меню"
                    className="burger-icon"
                />
            </div>
            <CustomSelect
                ref={selectRef}
                options={sites}
                value={selectedValue}
                onChange={handleSiteChange}
                placeholder="Все пользователи"
                loading={isLoading}
                searchable
                className={`site-select ${isOpen ? 'is-open' : ''}`}
                onMenuOpen={() => setIsOpen(true)}
                onMenuClose={() => setIsOpen(false)}
                menuIsOpen={isOpen}
            />
        </div>
    );
};

export default SiteSelection;