"use client";

import React, { useState } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend, Sector, ResponsiveContainer,
} from 'recharts';

type DataEntry = {
    name: string;
    value: number;
    metric: string
};

const data: DataEntry[] = [
    { name: 'Getränke', value: 100, metric: 'kcal' },
    { name: 'Früchte', value: 50, metric: 'kcal' },
    { name: 'Getreide, Kartoffeln', value: 100, metric: 'kcal' },
    { name: 'Öle, Fette, Saucen', value: 500, metric: 'kcal' },
    { name: 'Verarbeitete Lebensmittel', value: 800, metric: 'kcal' },
    { name: 'Proteinreiche Lebensmittel', value: 200, metric: 'kcal' },
    { name: 'Gemüse', value: 200, metric: 'kcal' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFE', '#FEA28D', '#8DFFF4', '#FFD700'];

const RADIAN = Math.PI / 180;

const renderActiveShape = (props: any) => {
    const {
        cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />

        </g>
    );
};

const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <>
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
                {`${value} ${payload.metric} `}
                <tspan fill="#999" fontSize="12" fontWeight="300">({(percent * 100).toFixed(0)}%)</tspan>
            </text>
        </>
    );
};

export default function EnergyChartCategories() {
    const [activeIndices, setActiveIndices] = useState<number[]>([]);

    const handleClick = (index: number) => {
        if (activeIndices.includes(index)) {
            setActiveIndices(activeIndices.filter(i => i !== index));
        } else {
            setActiveIndices([...activeIndices, index]);
        }
    };

    return (
        <div className='bg-white p-4 border rounded-lg' style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        activeIndex={activeIndices}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        innerRadius={0}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onClick={(e, index) => handleClick(index)}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                opacity={activeIndices.includes(index) ? 1 : 1}  // Bug: If I change opactiy to 0.5, and click on a section, the labels disappear for 1 second
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
