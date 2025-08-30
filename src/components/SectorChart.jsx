"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const SectorChart = ({ sectors }) => {
  if (!sectors) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Sector Allocation
        </h3>
        <div className="py-8 text-center text-gray-500">
          No sector data available
        </div>
      </div>
    );
  }

  // Convert sectors object to array for the chart
  const sectorData = Object.values(sectors).map((sector, index) => ({
    name: sector.sectorName,
    value: sector.totalInvestment,
    presentValue: sector.totalPresentValue,
    gainLoss: sector.totalGainLoss,
    gainLossPercentage: sector.totalGainLossPercentage,
    stocksCount: sector.stocks.length,
    percentage: 0, // Will be calculated
  }));

  // Calculate percentages
  const totalInvestment = sectorData.reduce(
    (sum, sector) => sum + sector.value,
    0
  );
  sectorData.forEach((sector) => {
    sector.percentage =
      totalInvestment > 0 ? (sector.value / totalInvestment) * 100 : 0;
  });

  // Colors for the pie chart
  const COLORS = [
    "#3b158a", // Primary purple
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#a855f7", // Purple
    "#c084fc", // Light purple
    "#d8b4fe", // Very light purple
    "#e9d5ff", // Lightest purple
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          <h4 className="mb-2 font-semibold text-gray-900">{data.name}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Investment:</span>
              <span className="font-medium">
                ₹{data.value.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Present Value:</span>
              <span className="font-medium">
                ₹{data.presentValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gain/Loss:</span>
              <span
                className={`font-medium ${
                  data.gainLoss >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{data.gainLoss.toLocaleString()} (
                {data.gainLossPercentage.toFixed(2)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stocks:</span>
              <span className="font-medium">{data.stocksCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Allocation:</span>
              <span className="font-medium">{data.percentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white border border-gray-200 shadow-sm rounded-xl"
    >
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Sector Allocation
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Portfolio distribution by sector
        </p>
      </div>

      <div className="p-6">
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ percentage }) => `${percentage.toFixed(1)}%`}
                labelLine={false}
              >
                {sectorData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sector Legend and Details */}
        <div className="space-y-3">
          {sectorData.map((sector, index) => (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 transition-colors rounded-lg bg-gray-50 hover:bg-primary-50"
            >
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div>
                  <div className="font-medium text-gray-900">{sector.name}</div>
                  <div className="text-xs text-gray-500">
                    {sector.stocksCount} stock
                    {sector.stocksCount !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {sector.percentage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">
                  ₹{sector.value.toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sector Performance Summary */}
        <div className="p-4 mt-6 rounded-lg bg-primary-50">
          <h4 className="mb-3 font-medium text-gray-900">Sector Performance</h4>
          <div className="space-y-2">
            {sectorData
              .sort((a, b) => b.gainLossPercentage - a.gainLossPercentage)
              .slice(0, 3)
              .map((sector, index) => (
                <div
                  key={sector.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">
                    {index + 1}. {sector.name}
                  </span>
                  <span
                    className={`font-medium ${
                      sector.gainLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {sector.gainLossPercentage.toFixed(2)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SectorChart;
