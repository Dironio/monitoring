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
    survey_id: number;
    survey_text: string;
}

const SurveySelector: React.FC<SurveySelectorProps> = ({ onChange, disabled }) => {
    const [surveys, setSurveys] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSurvey, setSelectedSurvey] = useState<number>(() => {
        const saved = localStorage.getItem('selectedSurvey');
        return saved ? JSON.parse(saved).value : undefined;
    });

    const { selectedSite } = useSiteContext();

    const fetchSurveys = async () => {
        if (!selectedSite) {
            setLoading(false);
            return;
        }

        try {
            const response = await getAPI.get<Survey[]>(
                `/events/experiement/surveys?web_id=${selectedSite.value}`
            );

            const formattedSurveys: SelectOption[] = response.data.map(survey => ({
                value: survey.survey_id,
                label: survey.survey_text
            }));

            setSurveys(formattedSurveys);

            if (selectedSurvey && formattedSurveys.some(s => s.value === selectedSurvey)) {
                onChange(selectedSurvey);
            } else if (formattedSurveys.length > 0) {
                const firstSurveyId = formattedSurveys[0].value as number;
                setSelectedSurvey(firstSurveyId);
                onChange(firstSurveyId);
                localStorage.setItem('selectedSurvey', JSON.stringify({ value: firstSurveyId }));
            }
        } catch (error) {
            console.error('Error fetching surveys:', error);
            setSurveys([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (value: string | number | (string | number)[]) => {
        const numericValue = Number(value);
        if (!isNaN(numericValue)) {
            setSelectedSurvey(numericValue);
            onChange(numericValue);
            localStorage.setItem('selectedSurvey', JSON.stringify({ value: numericValue }));
        }
    };

    useEffect(() => {
        fetchSurveys();
    }, [selectedSite]);

    return (
        <div className="survey-selector">
            <img
                src="/assets/burger.svg"
                alt="Меню опросов"
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
                searchable
            />
        </div>
    );
};

export default SurveySelector;