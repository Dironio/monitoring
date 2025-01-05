import './EventAnalysisComponents.css'
import { useState, useEffect } from "react";
import axios from 'axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { RawEvent } from "../../../../models/event.model";
import { User } from "../../../../models/user.model";

// interface Event {
//   id: number;
//   event_id: number;
//   event_data: string;
//   timestamp: string;
//   web_id: number;
// }

interface EventAnalysisProps {
  user: User | null;
  loading: boolean;
}

interface DensityDataPoint {
  value: number;
  density: number;
  fill: string;
}

interface HourlyDataPoint {
  hour: number;
  count: number;
  fill: string;
}

interface EventStatsPoint {
  type: string;
  count: number;
  percentage: number;
  fill: string;
}

interface SelectedSite {
  value: number;
  label: string;
}

const EventAnalysisComponent: React.FC<EventAnalysisProps> = ({ user, loading }) => {
  const [selectedSite, setSelectedSite] = useState<SelectedSite | null>(() => {
    const savedSite = localStorage.getItem('selectedSite');
    return savedSite ? JSON.parse(savedSite) : null;
  });
  const [eventData, setEventData] = useState<RawEvent[]>([]);
  const [densityData, setDensityData] = useState<DensityDataPoint[]>([]);
  const [hourlyDistribution, setHourlyDistribution] = useState<HourlyDataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSite) return;

      try {
        const response = await axios.get<RawEvent[]>(
          `${process.env.REACT_APP_API_URL}/events/analysis?web_id=${selectedSite.value}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const rawData = response.data;
        setEventData(rawData);

        // Расчет плотности распределения длительности событий
        const calculateDensity = (): DensityDataPoint[] => {
          const binSize = 50;
          const bins: Record<number, number> = {};

          rawData.forEach(event => {
            const eventData = JSON.parse(event.event_data);
            const duration = eventData?.duration || 0;
            const bin = Math.floor(duration / binSize) * binSize;
            bins[bin] = (bins[bin] || 0) + 1;
          });

          return Object.entries(bins).map(([value, count]) => ({
            value: Number(value),
            density: count / rawData.length,
            fill: "hsl(var(--chart-1))"
          }));
        };

        // Расчет почасового распределения
        const calculateHourlyDistribution = (): HourlyDataPoint[] => {
          const hours = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            count: 0,
            fill: "hsl(var(--chart-2))"
          }));

          rawData.forEach(event => {
            const hour = new Date(event.timestamp).getHours();
            if (hours[hour]) {
              hours[hour].count++;
            }
          });

          return hours;
        };

        setDensityData(calculateDensity());
        setHourlyDistribution(calculateHourlyDistribution());
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, [selectedSite]);

  const calculateStats = (): EventStatsPoint[] => {
    const eventCounts: Record<string, number> = {};

    eventData.forEach(event => {
      const eventType = `Событие ${event.event_id}`;
      eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;
    });

    return Object.entries(eventCounts).map(([type, count], index) => ({
      type,
      count,
      percentage: (count / eventData.length) * 100,
      fill: `hsl(var(--chart-${index + 1}))`
    }));
  };

  return (
    <div className="event-analysis">
      <div className="event-analysis__header">
        <h1 className="event-analysis__title">Анализ событий</h1>
        <select
          className="event-analysis__select"
          value={selectedSite?.value}
          onChange={(e) => {
            const site = {
              value: Number(e.target.value),
              label: `Сайт ${e.target.value}`
            };
            setSelectedSite(site);
            localStorage.setItem('selectedSite', JSON.stringify(site));
          }}
        >
          <option value="">Выберите сайт</option>
          <option value="1">Сайт 1</option>
          <option value="2">Сайт 2</option>
        </select>
      </div>

      <div className="event-analysis__tabs">
        <div className="event-analysis__card">
          <div className="event-analysis__card-header">
            <h2 className="event-analysis__card-title">
              График плотности распределения длительности событий
            </h2>
          </div>
          <div className="event-analysis__chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={densityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="value"
                  label={{ value: 'Длительность (мс)', position: 'bottom' }}
                />
                <YAxis
                  label={{ value: 'Плотность', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="density"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="event-analysis__card">
          <div className="event-analysis__card-header">
            <h2 className="event-analysis__card-title">
              Почасовое распределение событий
            </h2>
          </div>
          <div className="event-analysis__chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="event-analysis__card">
          <div className="event-analysis__card-header">
            <h2 className="event-analysis__card-title">
              Распределение типов событий
            </h2>
          </div>
          <div className="event-analysis__chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calculateStats()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalysisComponent;
