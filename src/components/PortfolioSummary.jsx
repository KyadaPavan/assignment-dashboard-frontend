"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Building2,
  Activity,
} from "lucide-react";

const PortfolioSummary = ({ summary, cached }) => {
  if (!summary) return null;

  const {
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
    totalGainLossPercentage,
    totalStocks,
    sectorsCount,
  } = summary;

  const isPositiveReturn = totalGainLoss >= 0;

  const summaryCards = [
    {
      title: "Total Investment",
      value: `₹${totalInvestment.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary-500",
      bgColor: "bg-primary-50",
      borderColor: "border-gray-200",
      textColor: "text-gray-900",
    },
    {
      title: "Present Value",
      value: `₹${totalPresentValue.toLocaleString()}`,
      icon: PieChart,
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-gray-900",
    },
    {
      title: "Gain/Loss",
      value: `₹${totalGainLoss.toLocaleString()}`,
      subValue: `${totalGainLossPercentage.toFixed(2)}%`,
      icon: isPositiveReturn ? TrendingUp : TrendingDown,
      color: isPositiveReturn ? "text-green-600" : "text-red-600",
      bgColor: isPositiveReturn ? "bg-green-50" : "bg-red-50",
      borderColor: isPositiveReturn ? "border-green-200" : "border-red-200",
      textColor: "text-gray-900",
    },
    {
      title: "Total Stocks",
      value: totalStocks.toString(),
      icon: Building2,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      textColor: "text-gray-900",
    },
    {
      title: "Sectors",
      value: sectorsCount.toString(),
      icon: Activity,
      color: "text-primary-500",
      bgColor: "bg-primary-100",
      borderColor: "border-gray-200",
      textColor: "text-gray-900",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Portfolio Overview</h2>
        {cached && (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
            <div className="w-2 h-2 mr-2 rounded-full bg-primary-500"></div>
            Cached Data
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        {summaryCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl border ${card.borderColor} ${card.bgColor} p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${card.bgColor} ${card.color}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">
                  {card.title}
                </h3>
                <div className="mt-2">
                  <div className={`text-2xl font-bold ${card.textColor}`}>
                    {card.value}
                  </div>
                  {card.subValue && (
                    <div className={`text-sm ${card.color} mt-1 font-medium`}>
                      {card.subValue}
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 opacity-10">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br ${card.color.replace(
                    "text-",
                    "from-"
                  )} to-transparent`}
                ></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500">
              {((totalPresentValue / totalInvestment) * 100).toFixed(1)}%
            </div>
            <div className="mt-1 text-sm text-gray-600">Portfolio Return</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-700">
              ₹
              {(totalPresentValue / totalStocks).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="mt-1 text-sm text-gray-600">Avg Stock Value</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-700">
              ₹
              {(totalInvestment / totalStocks).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="mt-1 text-sm text-gray-600">Avg Investment</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PortfolioSummary;
