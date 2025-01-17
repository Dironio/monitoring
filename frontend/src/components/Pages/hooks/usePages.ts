import { useState, useCallback } from 'react';
import axios from 'axios';
import { PageOption } from './useHeatmaps';

export const usePages = (site: { value: string } | null) => {
    const [pages, setPages] = useState<PageOption[]>([]);

    const fetchPages = useCallback(async () => {
        if (!site?.value) return;

        try {
            const response = await axios.get<string[]>(
                `${process.env.REACT_APP_API_URL}/events/pages`,
                {
                    params: { web_id: site.value },
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            const pageOptions = response.data.map(page => ({
                value: page,
                label: page
            }));

            setPages(pageOptions);
        } catch (error) {
            console.error('Error fetching pages:', error);
        }
    }, [site?.value]);

    return { pages, fetchPages };
};