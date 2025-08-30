"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const PortfolioTable = ({ stocks }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Reset sorting when component mounts to clear any cached references
  useEffect(() => {
    setSorting([]);
  }, []);

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor("stockName", {
        header: "Stock Name",
        cell: ({ row }) => (
          <div className="font-medium text-gray-900">
            {row.original.stockName}
            <div className="text-sm text-gray-500">{row.original.symbol}</div>
          </div>
        ),
      }),
      columnHelper.accessor("sector", {
        header: "Sector",
        cell: ({ getValue }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("quantity", {
        header: "Qty",
        cell: ({ getValue }) => getValue().toLocaleString(),
      }),
      columnHelper.accessor("purchasePrice", {
        header: "Purchase Price",
        cell: ({ getValue }) => `₹${getValue().toFixed(2)}`,
      }),
      columnHelper.accessor("currentPrice", {
        header: "Current Price",
        cell: ({ getValue, row }) => {
          const current = getValue();
          const purchase = row.original.purchasePrice;
          const isHigher = current > purchase;
          return (
            <div className="flex items-center">
              <span
                className={
                  isHigher
                    ? "text-green-600"
                    : current < purchase
                    ? "text-red-600"
                    : "text-gray-900"
                }
              >
                ₹{current.toFixed(2)}
              </span>
              {isHigher ? (
                <TrendingUp className="w-3 h-3 ml-1 text-green-500" />
              ) : current < purchase ? (
                <TrendingDown className="w-3 h-3 ml-1 text-red-500" />
              ) : null}
            </div>
          );
        },
      }),
      columnHelper.accessor("investment", {
        header: "Investment",
        cell: ({ getValue }) => `₹${getValue().toLocaleString()}`,
      }),
      columnHelper.accessor("presentValue", {
        header: "Present Value",
        cell: ({ getValue }) => `₹${getValue().toLocaleString()}`,
      }),
      columnHelper.accessor("gainLoss", {
        header: "Gain/Loss",
        cell: ({ getValue, row }) => {
          const value = getValue();
          const percentage = row.original.gainLossPercentage;
          const isPositive = value >= 0;
          return (
            <div
              className={`font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <div>₹{value.toLocaleString()}</div>
              <div className="text-xs">({percentage.toFixed(2)}%)</div>
            </div>
          );
        },
      }),
      columnHelper.accessor("portfolioPercentage", {
        header: "Portfolio %",
        cell: ({ getValue }) => `${getValue().toFixed(2)}%`,
      }),
      columnHelper.accessor("latestEarnings", {
        header: "Latest Earnings",
        cell: ({ getValue }) => getValue() || "N/A",
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: stocks || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    // Add a unique key to force re-render when columns change
    enableSorting: true,
    enableGlobalFilter: true,
  });

  const getSortIcon = (isSorted) => {
    if (isSorted === "asc") return <ArrowUp className="w-4 h-4" />;
    if (isSorted === "desc") return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4" />;
  };

  if (!stocks || stocks.length === 0) {
    return (
      <div className="p-8 text-center bg-white border border-gray-200 rounded-xl">
        <div className="text-gray-500">No portfolio data available</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white border border-gray-200 shadow-sm rounded-xl"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Portfolio Holdings
          </h3>
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search stocks..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors cursor-pointer hover:bg-primary-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </span>
                      {header.column.getCanSort() && (
                        <span className="text-gray-400">
                          {getSortIcon(header.column.getIsSorted())}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="transition-colors hover:bg-primary-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.getRowModel().rows.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No stocks found matching your search criteria.
        </div>
      )}

      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {table.getRowModel().rows.length} of {stocks.length} stocks
          </div>
          <div>
            Total Investment: ₹
            {stocks
              .reduce((sum, stock) => sum + stock.investment, 0)
              .toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioTable;
