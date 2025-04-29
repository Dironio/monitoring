import interfaceDal from '../data/interface.dal';
import { ClickDetails, DetailedInteraction, DeviceGroup, ElementDetails, ElementGroup, ElementStat, HeatmapCell, LocationGroup, TimePoint, TimeRange } from './types/interface.dto';

// class InterfaceService {
//     async getInteractions(
//       webId: number, 
//       pageUrl: string, 
//       range: TimeRange
//     ) {
//       return interfaceDal.getInteractions(webId, pageUrl, range);
//     }

//     async getElementStats(
//       webId: number, 
//       pageUrl: string, 
//       range: TimeRange
//     ): Promise<ElementStat[]> {
//       const interactions = await this.getInteractions(webId, pageUrl, range);

//       const statsMap = interactions.reduce((acc, event) => {
//         const type = event.element_type || 'unknown';
//         if (!acc[type]) {
//           acc[type] = { count: 0, totalDuration: 0 };
//         }
//         acc[type].count += 1;
//         acc[type].totalDuration += event.duration;
//         return acc;
//       }, {} as Record<string, { count: number; totalDuration: number }>);

//       return Object.entries(statsMap).map(([type, { count, totalDuration }]) => ({
//         type,
//         count,
//         avg_duration: Math.round(totalDuration / count),
//         engagement: this.calculateEngagement(totalDuration, count)
//       })).sort((a, b) => b.count - a.count);
//     }

//     async getHeatmapData(
//       webId: number, 
//       pageUrl: string, 
//       range: TimeRange
//     ) {
//       return interfaceDal.getHeatmapData(webId, pageUrl, range);
//     }

//     private calculateEngagement(duration: number, clicks: number): number {
//       return Math.min(100, Math.round(Math.log1p(duration * clicks) * 10));
//     }
//   }


class InterfaceService {
  async getInteractions(
    webId: number,
    pageUrl: string,
    range: TimeRange
  ): Promise<DetailedInteraction[]> {
    return interfaceDal.getInteractions(webId, pageUrl, range);
  }

  async getElementStats(
    webId: number,
    pageUrl: string,
    range: TimeRange,
    withDetails: boolean = false
  ): Promise<ElementStat[]> {
    const interactions = await this.getInteractions(webId, pageUrl, range);

    const statsMap = interactions.reduce((acc, event) => {
      const type = event.element_type || 'unknown';
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          totalDuration: 0,
          classes: new Set<string>(),
          devices: new Set<string>(),
          locations: new Set<string>()
        };
      }
      acc[type].count += 1;
      acc[type].totalDuration += event.duration;

      if (event.element_classes) {
        event.element_classes.forEach(cls => acc[type].classes.add(cls));
      }

      if (event.browser && event.os) {
        acc[type].devices.add(`${event.browser} (${event.os})`);
      }

      if (event.country) {
        acc[type].locations.add(event.city ? `${event.city}, ${event.country}` : event.country);
      }

      return acc;
    }, {} as Record<string, {
      count: number;
      totalDuration: number;
      classes: Set<string>;
      devices: Set<string>;
      locations: Set<string>;
    }>);

    return Object.entries(statsMap).map(([type, data]) => ({
      type,
      count: data.count,
      avg_duration: Math.round(data.totalDuration / data.count),
      engagement: this.calculateEngagement(data.totalDuration, data.count),
      ...(withDetails && {
        classes: Array.from(data.classes),
        devices_count: data.devices.size,
        locations_count: data.locations.size
      })
    })).sort((a, b) => b.count - a.count);
  }

  async getHeatmapData(
    webId: number,
    pageUrl: string,
    range: TimeRange,
    withDetails: boolean = false
  ): Promise<HeatmapCell[]> {
    return interfaceDal.getHeatmapData(webId, pageUrl, range, withDetails);
  }

  async getElementDetails(
    webId: number,
    pageUrl: string,
    range: TimeRange,
    elementType: string
  ): Promise<ElementDetails> {
    const interactions = await this.getInteractions(webId, pageUrl, range);
    const filtered = interactions.filter(i => i.element_type === elementType);

    if (filtered.length === 0) {
      throw new Error('Element type not found');
    }

    return {
      type: elementType,
      total_interactions: filtered.length,
      avg_duration: Math.round(filtered.reduce((sum, i) => sum + i.duration, 0) / filtered.length),
      classes: this.extractClasses(filtered),
      devices: this.countDevices(filtered),
      locations: this.countLocations(filtered),
      time_distribution: this.groupByTime(filtered)
    };
  }

  private extractClasses(interactions: DetailedInteraction[]): { name: string, count: number }[] {
    const classMap: Record<string, number> = {};

    interactions.forEach(i => {
      i.element_classes?.forEach(cls => {
        if (cls) classMap[cls] = (classMap[cls] || 0) + 1;
      });
    });

    return Object.entries(classMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  private countDevices(interactions: DetailedInteraction[]): { name: string, count: number }[] {
    const deviceMap: Record<string, number> = {};

    interactions.forEach(i => {
      const device = `${i.os} ${i.browser}`;
      deviceMap[device] = (deviceMap[device] || 0) + 1;
    });

    return Object.entries(deviceMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  private countLocations(interactions: DetailedInteraction[]): { name: string, count: number }[] {
    const locationMap: Record<string, number> = {};

    interactions.forEach(i => {
      const location = i.city ? `${i.country}, ${i.city}` : i.country;
      locationMap[location] = (locationMap[location] || 0) + 1;
    });

    return Object.entries(locationMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }














  async getClickDetails(
    webId: number,
    pageUrl: string,
    range: TimeRange,
    x: number,
    y: number
  ): Promise<ClickDetails> {
    const interactions = await interfaceDal.getDetailedInteractions(
      webId, pageUrl, range, undefined, { x, y }
    );

    return {
      coordinates: { x, y },
      total_clicks: interactions.length,
      avg_duration: Math.round(interactions.reduce((sum, i) => sum + i.duration, 0) / interactions.length),
      elements: this.groupByElement(interactions),
      devices: this.groupByDevice(interactions),
      locations: this.groupByLocation(interactions),
      time_distribution: this.groupByTime(interactions)
    };
  }

  private calculateEngagement(duration: number, clicks: number): number {
    return Math.min(100, Math.round(Math.log1p(duration * clicks) * 10));
  }

  private analyzeInteractions(interactions: DetailedInteraction[], elementType: string): ElementDetails {
    return {
      type: elementType,
      total_interactions: interactions.length,
      avg_duration: Math.round(interactions.reduce((sum, i) => sum + i.duration, 0) / interactions.length),
      classes: this.countUnique(interactions.flatMap(i => i.element_classes || [])),
      devices: this.countUnique(interactions.map(i => `${i.browser} (${i.os})`)),
      locations: this.countUnique(interactions.map(i => i.city ? `${i.city}, ${i.country}` : i.country)),
      time_distribution: this.groupByTime(interactions)
    };
  }

  private countUnique(items: string[]): { name: string, count: number }[] {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      if (item) counts[item] = (counts[item] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }





  private groupByElement(interactions: DetailedInteraction[]): ElementGroup[] {
    const elementMap: Record<string, {
      count: number;
      classes: Set<string>;
    }> = {};

    interactions.forEach(interaction => {
      const type = interaction.element_type || 'unknown';
      if (!elementMap[type]) {
        elementMap[type] = {
          count: 0,
          classes: new Set<string>()
        };
      }

      elementMap[type].count += 1;

      if (interaction.element_classes) {
        interaction.element_classes.forEach(cls => {
          if (cls) elementMap[type].classes.add(cls);
        });
      }
    });

    return Object.entries(elementMap).map(([type, data]) => ({
      type,
      count: data.count,
      classes: Array.from(data.classes),
      percentage: Math.round((data.count / interactions.length) * 100)
    })).sort((a, b) => b.count - a.count);
  }

  private groupByDevice(interactions: DetailedInteraction[]): DeviceGroup[] {
    const deviceMap: Record<string, number> = {};

    interactions.forEach(interaction => {
      const deviceKey = `${interaction.browser || 'unknown'} (${interaction.os || 'unknown'})`;
      deviceMap[deviceKey] = (deviceMap[deviceKey] || 0) + 1;
    });

    const total = interactions.length;
    return Object.entries(deviceMap)
      .map(([device, count]) => ({
        device,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }

  private groupByLocation(interactions: DetailedInteraction[]): LocationGroup[] {
    const locationMap: Record<string, number> = {};

    interactions.forEach(interaction => {
      let locationKey = 'Неизвестно';
      if (interaction.country) {
        locationKey = interaction.city
          ? `${interaction.city}, ${interaction.country}`
          : interaction.country;
      }
      locationMap[locationKey] = (locationMap[locationKey] || 0) + 1;
    });

    const total = interactions.length;
    return Object.entries(locationMap)
      .map(([location, count]) => ({
        location,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }

  private groupByTime(interactions: DetailedInteraction[]): TimePoint[] {
    // Группировка по часам дня (0-23)
    const hoursMap = Array(24).fill(0).map((_, i) => ({
      hour: i,
      count: 0
    }));

    interactions.forEach(interaction => {
      try {
        const date = new Date(interaction.timestamp);
        const hour = date.getHours();
        hoursMap[hour].count += 1;
      } catch (e) {
        console.error('Error parsing timestamp', interaction.timestamp);
      }
    });

    // Нормализуем данные для графика
    const maxCount = Math.max(...hoursMap.map(h => h.count));
    return hoursMap.map(hourData => ({
      time: `${hourData.hour}:00`,
      count: hourData.count,
      normalized: maxCount > 0 ? (hourData.count / maxCount) * 100 : 0
    }));
  }
}






const interfaceService = new InterfaceService();
export default interfaceService;