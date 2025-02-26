import { Router } from "express";
import authCheck from '../middlewares/auth.check';
import behaviorController from "../controllers/behavior.controller";

const behaviorRouter: Router = Router();

// Основные метрики
behaviorRouter.get('/metrics/loading-speed', authCheck, behaviorController.getPageLoadingSpeed);
behaviorRouter.get('/metrics/total-users', authCheck, behaviorController.getTotalUsers);
behaviorRouter.get('/metrics/total-sessions', authCheck, behaviorController.getTotalVisits);
behaviorRouter.get('/metrics/returning-users', authCheck, behaviorController.getReturningUsers);
behaviorRouter.get('/metrics/bounce-rate', authCheck, behaviorController.getBounceRate);
behaviorRouter.get('/metrics/sales', authCheck, behaviorController.getTotalSales);
behaviorRouter.get('/metrics/conversions', authCheck, behaviorController.getTotalConversions);
behaviorRouter.get('/metrics/active-users', authCheck, behaviorController.getActiveUsers);

// Поведенческий анализ
behaviorRouter.get('/behavior/average-time', authCheck, behaviorController.getAverageTimeOnSite);
behaviorRouter.get('/behavior/average-depth', authCheck, behaviorController.getAveragePageDepth);
behaviorRouter.get('/behavior/clicks', authCheck, behaviorController.getClickAnalysis);
behaviorRouter.get('/behavior/events', authCheck, behaviorController.getEventAnalysis);
behaviorRouter.get('/behavior/scroll-percentage', authCheck, behaviorController.getAverageScrollPercentage);
behaviorRouter.get('/behavior/form-analysis', authCheck, behaviorController.getFormAnalysis);

// Технические метрики
behaviorRouter.get('/technical/session-duration', authCheck, behaviorController.getPerformanceMetrics);
behaviorRouter.get('/technical/errors', authCheck, behaviorController.getErrorAnalysis);
behaviorRouter.get('/technical/uptime', authCheck, behaviorController.getUptimeStatus);
behaviorRouter.get('/technical/resource-analysis', authCheck, behaviorController.getResourceAnalysis);
behaviorRouter.get('/technical/seo-analysis', authCheck, behaviorController.getSeoAnalysis);
behaviorRouter.get('/technical/active-users-now', authCheck, behaviorController.getActiveUsersNow);
behaviorRouter.get('/technical/active-users-comparison', authCheck, behaviorController.getActiveUsersComparison);

// География пользователей
behaviorRouter.get('/geography/user-locations', authCheck, behaviorController.getUserGeolocation);
behaviorRouter.get('/geography/top-countries', authCheck, behaviorController.getTopCountries);
behaviorRouter.get('/geography/top-cities', authCheck, behaviorController.getTopCities);
behaviorRouter.get('/geography/user-regions', authCheck, behaviorController.getUserRegions);
behaviorRouter.get('/geography/comparison', authCheck, behaviorController.getGeolocationComparison);

export default behaviorRouter;