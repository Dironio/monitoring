import { Router } from "express";
import authCheck from '../middlewares/auth.check';
import clusteringController from '../controllers/clustering.controller'

const clusteringRouter: Router = Router();

// clusteringRouter.get('/raw-data', authCheck, clusteringController.getRawData);
// clusteringRouter.get('/user-patterns', authCheck, clusteringController.getUserPatterns);
clusteringRouter.get('/interaction-clusters', authCheck, clusteringController.getInteractionClusters);
clusteringRouter.get('/temporal-analysis', authCheck, clusteringController.getTemporalAnalysis);
clusteringRouter.get('/summary', authCheck, clusteringController.getAnalysisSummary);


clusteringRouter.get('/user-analysis', authCheck, clusteringController.getUserAnalysis);

export default clusteringRouter;