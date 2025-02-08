import './EventAnalysisComponents.css'
import { useState, useEffect } from "react";
import axios from 'axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { BinMap, DensityPoint, EventTypeStats, HourlyPoint, RawEvent, TypeStatsMap } from "../../../../models/event.model";
import { User } from "../../../../models/user.model";
import { EventAnalyticsService } from '../../../utils/EventAnalyticsService';
import PageLoadingSpeed from './Components/PageLoadingSpeed';
import TotalUsers from './Components/TotalUsers';
import TotalVisits from './Components/TotalVisits';
import ReturningUserRate from './Components/ReturningUserRate';
import BounceRate from './Components/BounceRate';
import SalesRating from './Components/SalesRating';
import ConversionsMetric from './Components/Conversions';

interface EventAnalysisProps {
  user: User | null;
  loading: boolean;
}

// interface DensityDataPoint {
//   value: number;
//   density: number;
//   fill: string;
// }

// interface HourlyDataPoint {
//   hour: number;
//   count: number;
//   fill: string;
// }

// interface EventStatsPoint {
//   type: string;
//   count: number;
//   percentage: number;
//   fill: string;
// }

// interface SelectedSite {
//   value: number;
//   label: string;
// }

const EventAnalysisComponent: React.FC<EventAnalysisProps> = ({ user, loading }) => {
  const [metrics, setMetrics] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/events/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleMetricChange = (metric) => {
    setSelectedMetric(metric);
  };

  return (
    <div className="main-metrics-page">
      <h1>Основные показатели</h1>

      <div className="metrics-grid">
        <PageLoadingSpeed />
        <TotalUsers />
        <TotalVisits />
        <ReturningUserRate />
        <BounceRate />
        <SalesRating />
        <ConversionsMetric />
      </div>
    </div>
  );
};

export default EventAnalysisComponent;



























// const [eventData, setEventData] = useState<RawEvent[]>([]);
// const [isRefreshing, setIsRefreshing] = useState(false);
// const [selectedSite, setSelectedSite] = useState<SelectedSite | null>(() => {
//   const savedSite = localStorage.getItem('selectedSite');
//   return savedSite ? JSON.parse(savedSite) : null;
// });

// const fetchAnalysisData = async (siteId: number) => {
//   try {
//     setIsRefreshing(true);
//     const response = await axios.get<RawEvent[]>(
//       `${process.env.REACT_APP_API_URL}/events/analysis?web_id=${siteId}`,
//       {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       }
//     );
//     setEventData(response.data);
//   } catch (error) {
//     console.error("Ошибка при получении данных:", error);
//   } finally {
//     setIsRefreshing(false);
//   }
// };

// const handleRefresh = () => {
//   if (selectedSite) {
//     fetchAnalysisData(selectedSite.value);
//   }
// };

// useEffect(() => {
//   const handleSiteChange = (event: CustomEvent<{ site: SelectedSite }>) => {
//     const newSite = event.detail.site;
//     setSelectedSite(newSite);
//     if (newSite) {
//       fetchAnalysisData(newSite.value);
//     }
//   };

//   window.addEventListener('siteChanged', handleSiteChange as EventListener);

//   if (selectedSite) {
//     fetchAnalysisData(selectedSite.value);
//   }

//   return () => {
//     window.removeEventListener('siteChanged', handleSiteChange as EventListener);
//   };
// }, []);

// if (loading) {
//   return <div>Загрузка...</div>;
// }

// if (!user) {
//   return <div>Пользователь не авторизован</div>;
// }
// return (
//   <div className="event-analysis">
//     <div className="event-analysis__header">
//       <h1>Анализ событий</h1>
//       <button
//         className="refresh-button"
//         onClick={handleRefresh}
//         disabled={!selectedSite || isRefreshing}
//       >
//         {isRefreshing ? 'Обновление...' : 'Обновить данные'}
//       </button>
//     </div>
//     <div className="event-analysis__content">
//       <div className="event-analysis__card">
//         <h2 className="event-analysis__card-title">
//           Плотность распределения длительности событий
//         </h2>
//         <div className="event-analysis__chart-container">
//           <ResponsiveContainer width="100%" height={400}>
//             <AreaChart
//               data={EventAnalyticsService.calculateDensityData(eventData)}
//               margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
//             >
//               <defs>
//                 <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="value"
//                 label={{
//                   value: 'Длительность (мс)',
//                   position: 'insideBottom',
//                   offset: -10
//                 }}
//                 tickFormatter={(value) => `${value}мс`}
//               />
//               <YAxis
//                 label={{
//                   value: 'Плотность',
//                   angle: -90,
//                   position: 'insideLeft',
//                   offset: -5
//                 }}
//                 tickFormatter={(value) => value.toFixed(4)}
//               />
//               <Tooltip
//                 formatter={(value: number) => [value.toFixed(4), 'Плотность']}
//                 labelFormatter={(label) => `Длительность: ${label}мс`}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="density"
//                 stroke="#8884d8"
//                 fillOpacity={1}
//                 fill="url(#colorDensity)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//           <div className="event-analysis__description">
//             <h3>Методология расчета:</h3>
//             <p>График показывает распределение длительности событий, используя метод оценки плотности ядра.</p>
//           </div>
//         </div>
//       </div>

//       <div className="event-analysis__card">
//         <h2 className="event-analysis__card-title">
//           Почасовое распределение событий
//         </h2>
//         <div className="event-analysis__chart-container">
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={EventAnalyticsService.calculateHourlyDistribution(eventData)}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="hour"
//                 label={{ value: 'Час суток', position: 'bottom' }}
//               />
//               <YAxis label={{ value: 'Количество событий', angle: -90, position: 'insideLeft' }} />
//               <Tooltip />
//               <Bar dataKey="count" fill="#82ca9d" />
//             </BarChart>
//           </ResponsiveContainer>
//           <div className="event-analysis__description">
//             <h3>Методология расчета:</h3>
//             <p>Анализ временных рядов проведен с использованием метода агрегации по часовым интервалам.</p>
//           </div>
//         </div>
//       </div>

//       <div className="event-analysis__card">
//         <h2 className="event-analysis__card-title">
//           Распределение типов событий
//         </h2>
//         <div className="event-analysis__chart-container">
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={EventAnalyticsService.calculateEventTypeStats(eventData)}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="type" />
//               <YAxis />
//               <Tooltip content={({ payload }) => (
//                 <div className="event-analysis__tooltip">
//                   {payload?.[0]?.payload?.type}: {payload?.[0]?.payload?.count} событий
//                   <br />
//                   {payload?.[0]?.payload?.description}
//                 </div>
//               )} />
//               <Bar dataKey="count" fill="#8884d8" />
//             </BarChart>
//           </ResponsiveContainer>
//           <div className="event-analysis__description">
//             <h3>Методология расчета:</h3>
//             <p>Категориальный анализ проведен с использованием группировки по типам событий.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );