import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { SiteSelection } from './SiteSelection';

export interface PageOption {
    value: string;
    label: string;
    fullUrl: string;
    path: string;
}

interface PageSelectorProps {
    selectedPage: PageOption | null;
    selectedSite: SiteSelection | null;
    onPageChange: (page: PageOption | null) => void;
}

const PageSelector: React.FC<PageSelectorProps> = ({ selectedSite,
    selectedPage,
    onPageChange }) => {
    const [pages, setPages] = useState<PageOption[]>([]);
    const savedSite = localStorage.getItem('selectedSite');
    const site = savedSite ? JSON.parse(savedSite) : null;

    const getPathFromUrl = (url: string): string => {
        try {
            return url.replace(/^https?:\/\/[^\/]+(:\d+)?/, '');
        } catch {
            return url;
        }
    };

    const fetchPages = async () => {
        if (!site) return;

        try {
            const response = await axios.get<string[]>(
                `${process.env.REACT_APP_API_URL}/events/pages?web_id=${site.value}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }
                }
            );

            const groupedPages = response.data.reduce((acc: { [key: string]: string[] }, page) => {
                const path = getPathFromUrl(page);
                if (!acc[path]) {
                    acc[path] = [];
                }
                acc[path].push(page);
                return acc;
            }, {});

            const pageOptions = Object.entries(groupedPages).map(([path, urls]) => ({
                value: path,
                label: path,
                fullUrl: urls[0],
                path: path
            }));

            setPages(pageOptions);
        } catch (error) {
            console.error("Ошибка загрузки страниц", error);
            setPages([]);
        }
    };

    useEffect(() => {
        fetchPages();
    }, [selectedSite]);

    return (
        <div className="selector-container">
            <img
                src="/assets/burger.svg"
                alt=""
                className="selector-icon"
            />
            <Select
                value={selectedPage}
                options={pages}
                onChange={onPageChange}
                isDisabled={!selectedSite}
                isSearchable={true}
                placeholder="Выберите страницу"
                className="custom-select-container"
                classNamePrefix="custom-select"
                formatOptionLabel={(option: PageOption) => (
                    <div title={option.fullUrl}>{option.label}</div>
                )}
            />
        </div>
    );
};

export default PageSelector;