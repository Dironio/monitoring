import { useEffect, useState } from 'react';
import { getAPI } from '../utils/axiosGet';
import CustomSelect, { SelectOption } from './CustomSelect';
import './SurveysSelection.css';
import { useSiteContext } from '../utils/SiteContext';

interface SurveySelectorProps {
    onChange: (id: number | null) => void;
    disabled?: boolean;
}

interface Survey {
    id: number;
    text: string;
}

const SurveySelector: React.FC<SurveySelectorProps> = ({ onChange, disabled }) => {
    const [surveys, setSurveys] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSurvey, setSelectedSurvey] = useState<number>(() => {
        const saved = localStorage.getItem('selectedSurvey');
        return saved ? JSON.parse(saved).value : undefined;
    });

    const { selectedSite } = useSiteContext();

    useEffect(() => {
        if (selectedSite) {
            fetchSurveys();
        }
    }, [selectedSite]);

    const fetchSurveys = async () => {

        if (!selectedSite) {
            return;
        }

        try {
            const response = await getAPI.get<Survey[]>(
                `/events/experiement/surveys?web_id=${selectedSite.value}`
            );

            const formattedSurveys: SelectOption[] = response.data.map(survey => ({
                value: survey.id,
                label: survey.text
            }));
            setSurveys(formattedSurveys);
        } catch (error) {
            console.error('Error fetching surveys:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (value: string | number | (string | number)[]) => {
        const numericValue = Number(value);
        setSelectedSurvey(numericValue);
        onChange(numericValue);
    };

    useEffect(() => {
        fetchSurveys();
    }, []);

    return (
        <div className="survey-selector">
            <img
                src="/assets/burger.svg"
                alt="Меню страниц"
                className="selector-icon"
            />
            <CustomSelect
                options={surveys}
                value={selectedSurvey}
                onChange={handleChange}
                loading={loading}
                // disabled={disabled}
                className="survey-selector__select"
                placeholder="Выберите опрос"
            />
        </div>
    );
};

export default SurveySelector;