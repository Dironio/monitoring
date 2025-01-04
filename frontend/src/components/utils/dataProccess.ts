export const processData = (data: any[]) => {
    // Преобразование timestamp в более читаемый формат
    const trafficData = data.map((item) => ({
        date: new Date(item.timestamp).toLocaleDateString(),
        page: item.page_url,
        location: JSON.parse(item.geolocation)?.city || 'Unknown',
    }));

    // Группировка по датам для линейного графика
    const visitsByDate = trafficData.reduce((acc, item) => {
        acc[item.date] = (acc[item.date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const trafficChartData = Object.entries(visitsByDate).map(([date, visits]) => ({
        date,
        visits,
    }));

    // Группировка по локациям для круговой диаграммы
    const visitsByLocation = trafficData.reduce((acc, item) => {
        acc[item.location] = (acc[item.location] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const locationChartData = Object.entries(visitsByLocation).map(([location, visits]) => ({
        location,
        visits,
    }));

    return {
        trafficChartData,
        locationChartData,
        rawData: trafficData,
    };
};
