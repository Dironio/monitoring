import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TopCountry {
    country: string;
    users: number;
}

interface TopCountriesChartProps {
    data: TopCountry[];
}

const TopCountriesChart: React.FC<TopCountriesChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default TopCountriesChart;