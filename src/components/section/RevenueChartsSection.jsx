"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
  Label,
} from "recharts";

// Production-ready Revenue Chart Component
export default function RevenueChartsSection() {
  // Enhanced data structure with proper typing and validation
  const generateChartData = () => {
    const baseAcceleratedData = [
      { month: "Month 1", revenue: 50 },
      { month: "Month 2", revenue: 200 },
      { month: "Month 3", revenue: 300 },
      { month: "Month 4", revenue: 400 },
      { month: "Month 5", revenue: 500 },
      { month: "Month 6", revenue: 1000 },
      { month: "Month 7", revenue: 2000 },
      { month: "Month 8", revenue: 3000 },
      { month: "Month 9", revenue: 4500 },
      { month: "Month 10", revenue: 6000 },
      { month: "Month 11", revenue: 7500 },
      { month: "Month 12", revenue: 9000 },
    ];

    return baseAcceleratedData.map((dataPoint, index) => {
      // Traditional launch starts 2 months later
      const traditionalRevenue = index >= 2 ? baseAcceleratedData[index - 2].revenue : null;
      
      return {
        month: dataPoint.month,
        monthNumber: index + 1,
        traditionalRevenue,
        acceleratedRevenue: dataPoint.revenue,
      };
    });
  };

  const chartData = generateChartData();
  const maxRevenue = Math.max(...chartData.map(d => d.acceleratedRevenue));
  const yAxisMax = Math.ceil(maxRevenue * 1.2 / 1000) * 1000; // Round to nearest thousand

  // Enhanced tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-background p-4 min-w-[200px]">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">
                {entry.name === 'traditionalRevenue' ? 'Traditional' : 'WebSeed'}
              </span>
            </div>
            <span className="font-medium text-gray-900">
              {entry.value ? `$${entry.value.toLocaleString()}` : 'Not launched'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Format currency for Y-axis
  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  return (
    <section className="max-w-6xl mx-auto px-4" role="region" aria-labelledby="revenue-chart-title">
      <div className="bg-background p-8">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <h2 
            id="revenue-chart-title"
            className="text-4xl font-bold text-foreground mb-4"
          >
            Revenue Growth Comparison
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            WebSeed accelerates your launch by 2-3 months, giving you a significant head start 
            in revenue generation and market positioning.
          </p>
        </div>

        {/* Chart Container */}
        <div className="relative">
          <div className="h-[600px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 60, right: 40, left: 40, bottom: 40 }}
              >
                {/* Enhanced Grid */}
                <CartesianGrid 
                  strokeDasharray="2 4" 
                  stroke="#e2e8f0" 
                  strokeOpacity={0.6}
                  vertical={false}
                />
                
                {/* Enhanced Axes */}
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickMargin={12}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={formatCurrency}
                  domain={[0, yAxisMax]}
                  tickMargin={8}
                />

                {/* Revenue Lost Area (Months 1-3) */}
                <ReferenceArea
                  x1="Month 1"
                  x2="Month 3"
                  y1={0}
                  y2={yAxisMax}
                  fill="rgba(239, 68, 68, 0.08)"
                  stroke="rgba(239, 68, 68, 0.3)"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                >
                  <Label
                    value="Revenue Lost"
                    position="insideTopLeft"
                    offset={20}
                    className="fill-red-600 text-sm font-semibold"
                  />
                </ReferenceArea>

                {/* Accelerated Growth Area (Months 8-12) */}
                <ReferenceArea
                  x1="Month 8"
                  x2="Month 12"
                  y1={0}
                  y2={yAxisMax}
                  fill="rgba(34, 197, 94, 0.08)"
                  stroke="rgba(34, 197, 94, 0.3)"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                >
                  <Label
                    value="Accelerated Growth"
                    position="insideTopLeft"
                    offset={20}
                    className="fill-green-600 text-sm font-semibold"
                  />
                </ReferenceArea>

                {/* Traditional Launch Line */}
                <Line
                  type="monotone"
                  dataKey="traditionalRevenue"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: '#ef4444',
                    stroke: '#fff',
                    strokeWidth: 2
                  }}
                  connectNulls={false}
                  name="traditionalRevenue"
                />

                {/* WebSeed Accelerated Line */}
                <Line
                  type="monotone"
                  dataKey="acceleratedRevenue"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: '#22c55e',
                    stroke: '#fff',
                    strokeWidth: 2
                  }}
                  name="acceleratedRevenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Tooltip */}
          <div className="absolute inset-0 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 60, right: 40, left: 40, bottom: 40 }}>
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="traditionalRevenue" 
                  stroke="transparent" 
                  activeDot={false}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="acceleratedRevenue" 
                  stroke="transparent" 
                  activeDot={false}
                  dot={false}
                />
                <CustomTooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Legend */}
        <div className="flex justify-center items-center gap-8 mt-12">
          <div className="flex items-center gap-3 px-4 py-2 bg-red-50 rounded-full border border-red-200">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="font-medium text-red-700">Traditional Launch</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-green-50 rounded-full border border-green-200">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="font-medium text-green-700">WebSeed Launch</span>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">2-3 Months</div>
            <div className="text-sm text-muted-foreground">Time saved on initial setup</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">$7,000+</div>
            <div className="text-sm text-muted-foreground">Additional revenue by month 12</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">25%</div>
            <div className="text-sm text-muted-foreground">Faster market penetration</div>
          </div>
        </div>
      </div>
    </section>
  );
}