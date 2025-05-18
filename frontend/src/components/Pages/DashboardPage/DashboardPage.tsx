import React, { useState, useEffect } from 'react';
import { FilterBar } from './components/FilterBar';
import { ReportSection } from './components/ReportSection';
import { MetricCard } from './components/MetricCard';
import { PDFExport } from './components/PDFExport';
import { Tab, Tabs, TabList, TabPanel } from './components/Tabs';
import { VisitMetrics } from './components/metrics/VisitMetrics';
import { HeatmapVisualization } from './components/visualizations/HeatmapVisualization';
import { ClusteringVisualization } from './components/visualizations/ClusteringVisualization';
import { UMAPVisualization } from './components/visualizations/UMAPVisualization';
import { UserPathsVisualization } from './components/visualizations/UserPathsVisualization';
import { MarkovChainModel } from './components/analytics/MarkovChainModel';
import { EngagementScoreMetric } from './components/analytics/EngagementScoreMetric';
import { RetentionAnalysis } from './components/analytics/RetentionAnalysis';

interface Site {
    id: string;
    name: string;
}

interface Page {
    id: string;
    name: string;
    path: string;
    siteId: string;
}

interface FilterState {
    selectedSiteId: string | null;
    selectedPageId: string | null;
    dateRange: {
        startDate: Date | null;
        endDate: Date | null;
    };
}

const DashboardPage: React.FC = () => {
    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        selectedSiteId: null,
        selectedPageId: null,
        dateRange: {
            startDate: null,
            endDate: null
        }
    });

    // Mock data - would come from API
    const [sites, setSites] = useState<Site[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeSection, setActiveSection] = useState<'monitoring' | 'analysis'>('monitoring');

    // Fetch sites
    useEffect(() => {
        // Mock API call
        setTimeout(() => {
            setSites([
                { id: '1', name: 'Main Website' },
                { id: '2', name: 'E-commerce Store' },
                { id: '3', name: 'Blog' }
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    // Fetch pages when site changes
    useEffect(() => {
        if (filters.selectedSiteId) {
            setIsLoading(true);
            // Mock API call
            setTimeout(() => {
                setPages([
                    { id: '101', name: 'Home', path: '/', siteId: filters.selectedSiteId },
                    { id: '102', name: 'Products', path: '/products', siteId: filters.selectedSiteId },
                    { id: '103', name: 'About Us', path: '/about', siteId: filters.selectedSiteId },
                    { id: '104', name: 'Contact', path: '/contact', siteId: filters.selectedSiteId }
                ]);
                setIsLoading(false);
            }, 300);
        } else {
            setPages([]);
        }
    }, [filters.selectedSiteId]);

    // Handle filter changes
    const handleFilterChange = (newFilters: Partial<FilterState>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    };

    // Generate query parameters for API requests
    const getQueryParams = () => {
        const params: Record<string, string> = {};

        // Site is required
        if (filters.selectedSiteId) {
            params.siteId = filters.selectedSiteId;
        } else {
            return null; // Cannot generate params without site
        }

        // Optional filters
        if (filters.selectedPageId) {
            params.pageId = filters.selectedPageId;
        }

        if (filters.dateRange.startDate) {
            params.startDate = filters.dateRange.startDate.toISOString();
        }

        if (filters.dateRange.endDate) {
            params.endDate = filters.dateRange.endDate.toISOString();
        }

        return params;
    };

    // Check if we can fetch data
    const canFetchData = !!filters.selectedSiteId;

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="bg-white shadow-sm p-4">
                <h1 className="text-2xl font-bold text-gray-800">User Behavior Analytics Dashboard</h1>
            </header>

            <FilterBar
                sites={sites}
                pages={pages}
                selectedSiteId={filters.selectedSiteId}
                selectedPageId={filters.selectedPageId}
                dateRange={filters.dateRange}
                onFilterChange={handleFilterChange}
                isLoading={isLoading}
            />

            <div className="p-4 flex gap-4">
                <button
                    className={`px-4 py-2 rounded-md ${activeSection === 'monitoring' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveSection('monitoring')}
                >
                    Monitoring Metrics
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${activeSection === 'analysis' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveSection('analysis')}
                >
                    Analysis Metrics
                </button>
            </div>

            <main className="flex-grow p-4 overflow-auto">
                {!canFetchData ? (
                    <div className="text-center p-8 bg-white rounded-lg shadow">
                        <p className="text-lg text-gray-600">Please select a website to view analytics data</p>
                    </div>
                ) : (
                    <>
                        {activeSection === 'monitoring' && (
                            <div className="space-y-6">
                                <ReportSection title="Visit Overview">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <MetricCard title="Total Visits">
                                            <VisitMetrics queryParams={getQueryParams()} metricType="total" />
                                        </MetricCard>
                                        <MetricCard title="Unique Visitors">
                                            <VisitMetrics queryParams={getQueryParams()} metricType="unique" />
                                        </MetricCard>
                                        <MetricCard title="Avg. Visit Duration">
                                            <VisitMetrics queryParams={getQueryParams()} metricType="duration" />
                                        </MetricCard>
                                    </div>
                                </ReportSection>

                                <ReportSection title="Visit History" collapsible resizable>
                                    <VisitMetrics queryParams={getQueryParams()} metricType="history" />
                                </ReportSection>

                                <ReportSection title="User Paths" collapsible resizable>
                                    <UserPathsVisualization queryParams={getQueryParams()} />
                                </ReportSection>
                            </div>
                        )}

                        {activeSection === 'analysis' && (
                            <div className="space-y-6">
                                <ReportSection title="Behavioral Analysis" collapsible>
                                    <Tabs>
                                        <TabList>
                                            <Tab>Heatmaps</Tab>
                                            <Tab>Clustering</Tab>
                                            <Tab>UMAP</Tab>
                                        </TabList>

                                        <TabPanel>
                                            <HeatmapVisualization queryParams={getQueryParams()} />
                                        </TabPanel>
                                        <TabPanel>
                                            <ClusteringVisualization queryParams={getQueryParams()} />
                                        </TabPanel>
                                        <TabPanel>
                                            <UMAPVisualization queryParams={getQueryParams()} />
                                        </TabPanel>
                                    </Tabs>
                                </ReportSection>

                                <ReportSection title="Advanced Analytics" collapsible resizable>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <MetricCard title="Markov Chain Navigation Model">
                                            <MarkovChainModel queryParams={getQueryParams()} />
                                        </MetricCard>
                                        <MetricCard title="User Engagement Score">
                                            <EngagementScoreMetric queryParams={getQueryParams()} />
                                        </MetricCard>
                                        <MetricCard title="Retention Analysis">
                                            <RetentionAnalysis queryParams={getQueryParams()} />
                                        </MetricCard>
                                    </div>
                                </ReportSection>
                            </div>
                        )}
                    </>
                )}
            </main>

            <footer className="bg-white p-4 shadow-inner flex justify-between items-center">
                <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
                <PDFExport dashboardState={{
                    filters,
                    activeSection
                }} />
            </footer>
        </div>
    );
};

export default DashboardPage;




























// import React, { useState, useEffect, useRef } from 'react';
// import { getAPI } from '../api/api';
// import { FilterPanel } from './components/FilterPanel';
// import { SiteOption } from '../models/site.model';
// import { PageOption } from '../models/page.model';
// import { ReportSection } from './components/ReportSection';
// import MetricCard from './components/MetricCard';
// import PDFExportButton from './components/PDFExportButton';
// import { VisitMetrics } from './components/metrics/VisitMetrics';
// import { HeatmapVisualization } from './components/visualizations/HeatmapVisualization';
// import { ClusteringVisualization } from './components/visualizations/ClusteringVisualization';
// import { UMAPVisualization } from './components/visualizations/UMAPVisualization';
// import { UserPathsVisualization } from './components/visualizations/UserPathsVisualization';
// import { MarkovChainModel } from './components/analytics/MarkovChainModel';
// import { EngagementScoreAnalysis } from './components/analytics/EngagementScoreAnalysis';
// import { RetentionAnalysis } from './components/analytics/RetentionAnalysis';
// import { FunnelAnalysis } from './components/analytics/FunnelAnalysis';
// import { SentimentAnalysis } from './components/analytics/SentimentAnalysis';

// interface DateRange {
//   start: Date | null;
//   end: Date | null;
// }

// interface DashboardState {
//   selectedSite: SiteOption | null;
//   selectedPage: PageOption | null;
//   dateRange: DateRange;
//   activeSection: 'monitoring' | 'analysis';
//   isLoading: boolean;
// }

// const DashboardPage: React.FC = () => {
//   const [state, setState] = useState<DashboardState>({
//     selectedSite: null,
//     selectedPage: null,
//     dateRange: {
//       start: null,
//       end: null
//     },
//     activeSection: 'monitoring',
//     isLoading: false
//   });
  
//   const reportContainerRef = useRef<HTMLDivElement>(null);

//   // Обработчик изменения сайта
//   const handleSiteChange = (site: SiteOption | null) => {
//     setState(prev => ({
//       ...prev,
//       selectedSite: site,
//       selectedPage: null // Сбрасываем выбранную страницу при изменении сайта
//     }));
//   };

//   // Обработчик изменения страницы
//   const handlePageChange = (page: PageOption | null) => {
//     setState(prev => ({
//       ...prev,
//       selectedPage: page
//     }));
//   };

//   // Обработчик изменения диапазона дат
//   const handleDateRangeChange = (range: DateRange) => {
//     setState(prev => ({
//       ...prev,
//       dateRange: range
//     }));
//   };

//   // Переключение между секциями мониторинга и анализа
//   const toggleSection = (section: 'monitoring' | 'analysis') => {
//     setState(prev => ({
//       ...prev,
//       activeSection: section
//     }));
//   };

//   // Функция для формирования параметров запроса на основе выбранных фильтров
//   const getQueryParams = (): URLSearchParams | null => {
//     const params = new URLSearchParams();
    
//     // Сайт обязателен для запросов
//     if (state.selectedSite) {
//       params.append('web_id', state.selectedSite.value.toString());
//     } else {
//       return null;
//     }
    
//     // Опциональные параметры
//     if (state.selectedPage) {
//       params.append('page_url', state.selectedPage.value);
//     }
    
//     if (state.dateRange.start) {
//       params.append('start_date', state.dateRange.start.toISOString());
//     }
    
//     if (state.dateRange.end) {
//       params.append('end_date', state.dateRange.end.toISOString());
//     }
    
//     return params;
//   };

//   // Проверка возможности запроса данных
//   const canFetchData = !!state.selectedSite;

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm p-4 border-b border-gray-200">
//         <h1 className="text-2xl font-bold text-gray-800">Система анализа поведения пользователей</h1>
//       </header>

//       <FilterPanel 
//         selectedSite={state.selectedSite}
//         selectedPage={state.selectedPage}
//         dateRange={state.dateRange}
//         onSiteChange={handleSiteChange}
//         onPageChange={handlePageChange}
//         onDateRangeChange={handleDateRangeChange}
//       />

//       <div className="flex gap-4 p-4">
//         <button
//           className={`px-6 py-2 rounded-md font-medium transition-colors ${
//             state.activeSection === 'monitoring' 
//               ? 'bg-blue-600 text-white' 
//               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//           }`}
//           onClick={() => toggleSection('monitoring')}
//         >
//           Мониторинг
//         </button>
//         <button
//           className={`px-6 py-2 rounded-md font-medium transition-colors ${
//             state.activeSection === 'analysis' 
//               ? 'bg-blue-600 text-white' 
//               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//           }`}
//           onClick={() => toggleSection('analysis')}
//         >
//           Анализ
//         </button>
//       </div>

//       <main className="flex-grow p-4 overflow-auto" ref={reportContainerRef}>
//         {!canFetchData ? (
//           <div className="text-center p-8 bg-white rounded-lg shadow">
//             <p className="text-lg text-gray-600">Пожалуйста, выберите сайт для просмотра аналитики</p>
//           </div>
//         ) : (
//           <>
//             {state.activeSection === 'monitoring' && (
//               <div className="space-y-6">
//                 <ReportSection title="Обзор посещений">
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     <MetricCard title="Всего посещений">
//                       <VisitMetrics queryParams={getQueryParams()} metricType="total" />
//                     </MetricCard>
//                     <MetricCard title="Уникальные посетители">
//                       <VisitMetrics queryParams={getQueryParams()} metricType="unique" />
//                     </MetricCard>
//                     <MetricCard title="Среднее время на сайте">
//                       <VisitMetrics queryParams={getQueryParams()} metricType="duration" />
//                     </MetricCard>
//                   </div>
//                 </ReportSection>

//                 <ReportSection title="История посещений" collapsible resizable>
//                   <VisitMetrics queryParams={getQueryParams()} metricType="history" />
//                 </ReportSection>

//                 <ReportSection title="Пути пользователей" collapsible resizable>
//                   <UserPathsVisualization queryParams={getQueryParams()} />
//                 </ReportSection>
//               </div>
//             )}

//             {state.activeSection === 'analysis' && (
//               <div className="space-y-6">
//                 <ReportSection title="Визуализация поведения" collapsible resizable>
//                   <div className="flex flex-col space-y-6">
//                     <div className="bg-white p-4 rounded-lg shadow">
//                       <h3 className="text-lg font-medium mb-4">Тепловая карта кликов</h3>
//                       <HeatmapVisualization queryParams={getQueryParams()} />
//                     </div>
                    
//                     <div className="bg-white p-4 rounded-lg shadow">
//                       <h3 className="text-lg font-medium mb-4">Кластеризация пользователей (K-means)</h3>
//                       <ClusteringVisualization queryParams={getQueryParams()} />
//                     </div>
                    
//                     <div className="bg-white p-4 rounded-lg shadow">
//                       <h3 className="text-lg font-medium mb-4">UMAP проекция поведения</h3>
//                       <UMAPVisualization queryParams={getQueryParams()} />
//                     </div>
//                   </div>
//                 </ReportSection>

//                 <ReportSection title="Продвинутая аналитика" collapsible resizable>
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <MetricCard title="Модель Марковских цепей">
//                       <MarkovChainModel queryParams={getQueryParams()} />
//                     </MetricCard>
//                     <MetricCard title="Анализ вовлеченности пользователей">
//                       <EngagementScoreAnalysis queryParams={getQueryParams()} />
//                     </MetricCard>
//                     <MetricCard title="Анализ удержания">
//                       <RetentionAnalysis queryParams={getQueryParams()} />
//                     </MetricCard>
//                     <MetricCard title="Воронка конверсии">
//                       <FunnelAnalysis queryParams={getQueryParams()} />
//                     </MetricCard>
//                     <MetricCard title="Анализ удовлетворенности">
//                       <SentimentAnalysis queryParams={getQueryParams()} />
//                     </MetricCard>
//                   </div>
//                 </ReportSection>
//               </div>
//             )}
//           </>
//         )}
//       </main>

//       <footer className="bg-white p-4 shadow-inner flex justify-between items-center">
//         <span className="text-sm text-gray-500">Последнее обновление: {new Date().toLocaleString('ru-RU')}</span>
//         <PDFExportButton 
//           reportContainerRef={reportContainerRef}
//           dashboardState={{
//             selectedSite: state.selectedSite,
//             selectedPage: state.selectedPage,
//             dateRange: state.dateRange,
//             activeSection: state.activeSection
//           }} 
//         />
//       </footer>
//     </div>
//   );
// };

// export default DashboardPage;

















/*































*/