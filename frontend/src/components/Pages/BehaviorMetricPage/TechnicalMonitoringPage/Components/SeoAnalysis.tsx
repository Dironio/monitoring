import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SeoData {
    page: string;
    titleLength: number;
    metaDescriptionLength: number;
    h1Count: number;
}

const SeoAnalysis: React.FC = () => {
    const [seoData, setSeoData] = useState<SeoData[]>([]);

    useEffect(() => {
        fetchSeoData();
    }, []);

    const fetchSeoData = async () => {
        try {
            const response = await axios.get<SeoData[]>('/events/seo');
            setSeoData(response.data);
        } catch (error) {
            console.error('Error fetching SEO data:', error);
        }
    };

    return (
        <div className="metric-card">
            <h2>SEO-анализ</h2>
            <ul>
                {seoData.map((item, index) => (
                    <li key={index}>
                        <strong>{item.page}</strong>: Заголовок ({item.titleLength} симв.), Описание ({item.metaDescriptionLength} симв.), H1: {item.h1Count}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SeoAnalysis;