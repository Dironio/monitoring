import { useEffect } from 'react';
import { useSiteContext } from '../../../../utils/SiteContext';
import SurveySelector from '../../../../UI/SurveysSelection';
import SiteSelection from '../../../../UI/SiteSelection';
import { User } from '../../../../../models/user.model';

interface ExperimentFiltersProps {
    disabled?: boolean;
    user: User | null;
}

const ExperimentFilters: React.FC<ExperimentFiltersProps> = ({ user, disabled }) => {
    const {
        selectedSite,
        setSelectedSite,
        setSelectedSurvey
    } = useSiteContext();

    useEffect(() => {
        if (!selectedSite) {
            setSelectedSurvey?.(null);
        }
    }, [selectedSite]);

    return (
        <div className="filters-wrapper">
            <SiteSelection
                user={user}
                loading={disabled || false}
                onSiteChange={setSelectedSite}
                disabled={disabled}
            />
            <SurveySelector
                onChange={setSelectedSurvey!}
                disabled={disabled || !selectedSite}
            />
        </div>
    );
};

export default ExperimentFilters;