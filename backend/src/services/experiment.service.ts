import experimentDal from '../data/experiment.dal';
import { SurveySelector, SurveyVote } from '../data/@types/experiment.dao';

class ExperimentService {
    async getSurveysSelector(webId: number): Promise<SurveySelector[]> {
        return await experimentDal.getSurveysSelector(webId);
    }

    async getSurveyVotes(webId: number, surveyId: number): Promise<SurveyVote[]> {
        return await experimentDal.getSurveyVotes(webId, surveyId);
    }
}

const experimentService = new ExperimentService();
export default experimentService;