import { DensityPoint, EventTypeStats, HourlyPoint, RawEvent } from "../../models/event.model";

export class EventAnalyticsService {
    static calculateDensityData(events: RawEvent[]): DensityPoint[] {
        console.log('Processing events:', events);
    
        if (!Array.isArray(events) || events.length === 0) {
            return [];
        }
    
        const durations = events
            .map(event => {
                try {
                    const eventData = typeof event.event_data === 'string' 
                        ? JSON.parse(event.event_data) 
                        : event.event_data;
                    return Number(eventData?.duration);
                } catch (error) {
                    return null;
                }
            })
            .filter((duration): duration is number => 
                duration !== null && 
                Number.isFinite(duration) && 
                duration > 0
            );
    
        console.log('Valid durations count:', durations.length);
    
        if (durations.length === 0) {
            return [];
        }
    
        const minDuration = Math.min(...durations);
        const maxDuration = Math.max(...durations);
        
        //  Фридман-Диаконис определение ширины бина
        const iqr = this.calculateIQR(durations);
        const binWidth = 2 * iqr * Math.pow(durations.length, -1/3);
        
        // количество бинов
        const binCount = Math.max(
            10,
            Math.ceil((maxDuration - minDuration) / binWidth)
        );
    
        // равномерные бины
        const bins = new Array(binCount).fill(0);
        const actualBinWidth = (maxDuration - minDuration) / binCount;
    
        durations.forEach(duration => {
            const binIndex = Math.min(
                Math.floor((duration - minDuration) / actualBinWidth),
                binCount - 1
            );
            if (binIndex >= 0) {
                bins[binIndex]++;
            }
        });
    
        const points = bins.map((count, index) => {
            const x = Math.round(minDuration + (index * actualBinWidth));
            const density = count / (durations.length * actualBinWidth);
            return {
                value: x,
                density,
                fill: "hsl(var(--chart-1))"
            };
        });
    
        const result = points.filter(point => point.density > 0);
        
        console.log('Generated points:', result);
        return result;
    }
    
    // private static calculateIQR(numbers: number[]): number {
    //     const sorted = [...numbers].sort((a, b) => a - b);
    //     const q1 = sorted[Math.floor(sorted.length * 0.25)];
    //     const q3 = sorted[Math.floor(sorted.length * 0.75)];
    //     return q3 - q1;
    // }


    private static calculateIQR(values: number[]): number {
        const sorted = [...values].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        return q3 - q1;
    }

    static calculateHourlyDistribution(events: RawEvent[]): HourlyPoint[] {
        const hours = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            count: 0,
            fill: "hsl(var(--chart-2))"
        }));

        events.forEach(event => {
            const hour = new Date(event.timestamp).getHours();
            if (hour >= 0 && hour < 24) {
                hours[hour].count++;
            }
        });

        return hours;
    }

    static calculateEventTypeStats(events: RawEvent[]): EventTypeStats[] {
        const typeStats: { [key: string]: { count: number; description: string } } = {};
        const totalEvents = events.length;

        events.forEach(event => {
            const typeName = event.event_type || `Событие ${event.event_id}`;

            if (!typeStats[typeName]) {
                typeStats[typeName] = {
                    count: 0,
                    description: event.description || ''
                };
            }

            typeStats[typeName].count += 1;
        });

        return Object.entries(typeStats)
            .map(([type, data]) => ({
                type,
                count: data.count,
                description: data.description,
                percentage: (data.count / totalEvents) * 100,
                fill: `hsl(${Object.keys(typeStats).indexOf(type) * 137.508}deg, 70%, 50%)`
            }));
    }
}