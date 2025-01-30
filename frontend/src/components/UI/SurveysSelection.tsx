import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "";

interface Survey {
    id: number;
    text: string;
}

interface SurveySelectorProps {
    onSelect: (surveyId: number) => void;
}

const SurveySelector: React.FC<SurveySelectorProps> = ({ onSelect }) => {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSurveys();
    }, []);

    const fetchSurveys = async () => {
        try {
            const { data } = await axios.get(`/api/events?web_id=${selectedPage.value}`, {
                params: {

                }
            });

            const uniqueSurveys = data.reduce((acc: Survey[], event: any) => {
                const surveyData = event.event_data;
                if (surveyData?.survey_id && surveyData?.survey_text) {
                    if (!acc.some(s => s.id === surveyData.survey_id)) {
                        acc.push({
                            id: surveyData.survey_id,
                            text: surveyData.survey_text
                        });
                    }
                }
                return acc;
            }, []);

            setSurveys(uniqueSurveys);
        } catch (error) {
            console.error('Error fetching surveys:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className= "" >
        <Select onValueChange={ (value) => onSelect(Number(value)) }>
            <SelectTrigger className="" disabled = { loading } >
                <SelectValue placeholder={ loading ? "Загрузка..." : "Выберите опрос" } />
                    </SelectTrigger>
                    <SelectContent>
    {
        surveys.map((survey) => (
            <SelectItem key= { survey.id } value = { survey.id.toString() } >
            { survey.text }
            </SelectItem>
        ))
    }
    </SelectContent>
        </Select>
        </div>
  );
};

export default SurveySelector;