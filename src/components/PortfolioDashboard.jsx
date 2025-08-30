"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw, BarChart3, Activity, Clock } from "lucide-react";
import { portfolioApi } from "../services/api";
import PortfolioTable from "./PortfolioTable";
import PortfolioSummary from "./PortfolioSummary";
import SectorChart from "./SectorChart";

const PortfolioDashboard = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch portfolio data
  const fetchPortfolioData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await portfolioApi.getPortfolio(isRefresh);
      setPortfolioData(data);
      setLastUpdated(new Date());

      console.log("Portfolio data updated:", data);
    } catch (err) {
      console.error("Failed to fetch portfolio data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        fetchPortfolioData(true);
      }
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, loading, refreshing, fetchPortfolioData]);

  // Initial data fetch
  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  const handleRefresh = () => {
    fetchPortfolioData(true);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  if (loading && !portfolioData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8"
        >
          <RefreshCw className="w-8 h-8 text-primary-500" />
        </motion.div>
        <span className="ml-3 text-lg text-gray-700">
          Loading portfolio data...
        </span>
      </div>
    );
  }

  if (error && !portfolioData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="mb-4 text-xl text-red-500">
            Error Loading Portfolio
          </div>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => fetchPortfolioData()}
            className="px-6 py-2 text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-primary-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                Portfolio Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {lastUpdated.toLocaleTimeString()}
                </div>
              )}

              <button
                onClick={toggleAutoRefresh}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  autoRefresh
                    ? "bg-primary-100 text-primary-700 border border-primary-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                <Activity className="w-4 h-4 mr-1" />
                Auto-refresh {autoRefresh ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {portfolioData && (
          <div className="space-y-8">
            {/* Portfolio Summary */}
            <PortfolioSummary
              summary={portfolioData.summary}
              cached={portfolioData.cached}
            />

            {/* Charts and Table Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Sector Chart */}
              <div className="lg:col-span-1">
                <SectorChart sectors={portfolioData.sectors} />
              </div>

              {/* Portfolio Table */}
              <div className="lg:col-span-2">
                <PortfolioTable stocks={portfolioData.stocks} />
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && portfolioData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 mt-4 border border-red-200 rounded-lg bg-red-50"
          >
            <div className="flex items-center">
              <div className="text-sm text-red-600">⚠️ Warning: {error}</div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default PortfolioDashboard;
