import React, { useState, useEffect, useCallback, useMemo, use } from 'react';
import {
  ArrowPathIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, subDays, subMonths, subYears, startOfWeek, startOfMonth, startOfYear, isAfter, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { AuthContext } from '../Provider/AuthProvider';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('week'); // 'week', 'month', 'year'
  const [sortField, setSortField] = useState('saleDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [expandedSale, setExpandedSale] = useState(null);

  // Get current user data from AuthContext
  const { user } = use(AuthContext);

  // Helper function for safe currency formatting
  const formatCurrency = (value) => {
    // Check if value is undefined or not a number
    if (value === undefined || value === null || isNaN(Number(value))) {
      return '$0.00';
    }
    return '$' + Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  

  return (
    <div className="min-h-screen bg-gray-50 py-2 px-2 sm:py-4 sm:px-4 md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
            <ChartBarIcon className="h-5 w-5 md:h-8 md:w-8 text-blue-600" />
            My Sales Report
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 md:mt-2">
            Overview of your sales performance and trends
          </p>
        </div>

        {/* Time Filter - More compact on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
          <div className="bg-white p-2 sm:p-3 rounded-lg shadow-md flex flex-wrap gap-1 sm:gap-2">
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs md:text-sm font-medium ${timeFilter === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs md:text-sm font-medium ${timeFilter === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeFilter('year')}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs md:text-sm font-medium ${timeFilter === 'year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Year
            </button>
          </div>

          <button
            onClick={fetchSalesData}
            className="bg-white p-2 rounded-lg shadow-md flex items-center justify-center gap-1 text-xs sm:text-sm text-gray-600 hover:text-blue-600"
          >
            <ArrowPathIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Summary Cards - Optimized grid layout for all screen sizes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-6">
          {/* Total Sales */}
          <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 md:p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Total Sales</p>
                <p className="text-sm sm:text-lg md:text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(summaryMetrics.totalSales)}
                </p>
              </div>
              <div className="p-1 sm:p-2 md:p-3 rounded-full bg-blue-50">
                <CurrencyDollarIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Profit */}
          <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 md:p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Total Profit</p>
                <p className={`text-sm sm:text-lg md:text-2xl font-bold mt-1 ${summaryMetrics.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summaryMetrics.totalProfit)}
                </p>
              </div>
              <div className="p-1 sm:p-2 md:p-3 rounded-full bg-green-50">
                <CurrencyDollarIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 md:p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Total Orders</p>
                <p className="text-sm sm:text-lg md:text-2xl font-bold text-gray-900 mt-1">
                  {summaryMetrics.totalOrders.toString()}
                </p>
              </div>
              <div className="p-1 sm:p-2 md:p-3 rounded-full bg-indigo-50">
                <ShoppingBagIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 md:p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Avg. Order</p>
                <p className="text-sm sm:text-lg md:text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(summaryMetrics.averageOrderValue)}
                </p>
              </div>
              <div className="p-1 sm:p-2 md:p-3 rounded-full bg-amber-50">
                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart - Responsive height */}
        <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 md:p-6 mb-4 md:mb-6">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-4">Sales & Profit Trend</h2>
          <div className="h-40 sm:h-48 md:h-64 lg:h-72">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs sm:text-sm md:text-base text-gray-500">No data available for the selected time period</p>
              </div>
            ) : (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        // More readable ticks on small screens
                        maxTicksLimit: window.innerWidth < 768 ? 4 : 8,
                        callback: function (value) {
                          if (value >= 1000) {
                            return '$' + value / 1000 + 'k';
                          }
                          return '$' + value;
                        },
                        font: {
                          size: window.innerWidth < 768 ? 9 : 12
                        }
                      }
                    },
                    x: {
                      ticks: {
                        // Show fewer labels on mobile
                        maxTicksLimit: window.innerWidth < 768 ? 4 : 10,
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                          size: window.innerWidth < 768 ? 9 : 12
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        boxWidth: window.innerWidth < 768 ? 8 : 12,
                        font: {
                          size: window.innerWidth < 768 ? 10 : 12
                        },
                        padding: window.innerWidth < 768 ? 6 : 10
                      }
                    },
                    tooltip: {
                      bodyFont: {
                        size: window.innerWidth < 768 ? 10 : 12
                      },
                      titleFont: {
                        size: window.innerWidth < 768 ? 11 : 14
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Sales Table - Card-based on mobile, table on desktop */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-2 sm:p-3 md:p-4 border-b">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">My Sales Records</h2>
            <div className="text-xs text-gray-500">
              {sortedSales.length} {sortedSales.length === 1 ? 'record' : 'records'}
            </div>
          </div>

          {loading ? (
            <div className="py-6 sm:py-8 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-xs sm:text-sm md:text-base text-gray-500">No sales data found for the selected time period</p>
            </div>
          ) : (
            <>
              {/* Desktop Table - Hidden on mobile */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('saleDate')}
                      >
                        <div className="flex items-center gap-1">
                          Date
                          {sortField === 'saleDate' && (
                            sortDirection === 'asc' ?
                              <ArrowUpIcon className="h-3 w-3" /> :
                              <ArrowDownIcon className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th
                        scope="col"
                        className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('total')}
                      >
                        <div className="flex items-center gap-1">
                          Total
                          {sortField === 'total' && (
                            sortDirection === 'asc' ?
                              <ArrowUpIcon className="h-3 w-3" /> :
                              <ArrowDownIcon className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('totalProfit')}
                      >
                        <div className="flex items-center gap-1">
                          Profit
                          {sortField === 'totalProfit' && (
                            sortDirection === 'asc' ?
                              <ArrowUpIcon className="h-3 w-3" /> :
                              <ArrowDownIcon className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((sale) => (
                      <tr key={sale._id} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{sale.customerName || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{sale.customerPhone || 'No phone'}</div>
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-900">
                            {sale.saleDate ? format(new Date(sale.saleDate), 'MMM dd, yyyy') : 'Unknown date'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {sale.saleDate ? format(new Date(sale.saleDate), 'h:mm a') : ''}
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-900">
                            {sale.products?.length || 0} {sale.products?.length === 1 ? 'item' : 'items'}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-[200px]">
                            {sale.products?.map(p => p.name).join(', ') || 'No items'}
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">
                            {formatCurrency(sale.total)}
                          </div>
                          {(sale.discount > 0) && (
                            <div className="text-xs text-green-600">
                              {sale.discount}% discount
                            </div>
                          )}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                          <div className={`text-xs sm:text-sm font-medium ${(sale.totalProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(sale.totalProfit)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden">
                <div className="flex justify-between p-2 bg-gray-50 border-b">
                  <button
                    onClick={() => handleSort('saleDate')}
                    className="text-xs font-medium text-gray-500 flex items-center gap-1"
                  >
                    Sort by Date
                    {sortField === 'saleDate' && (
                      sortDirection === 'asc' ?
                        <ArrowUpIcon className="h-3 w-3" /> :
                        <ArrowDownIcon className="h-3 w-3" />
                    )}
                  </button>
                  <button
                    onClick={() => handleSort('total')}
                    className="text-xs font-medium text-gray-500 flex items-center gap-1"
                  >
                    Sort by Amount
                    {sortField === 'total' && (
                      sortDirection === 'asc' ?
                        <ArrowUpIcon className="h-3 w-3" /> :
                        <ArrowDownIcon className="h-3 w-3" />
                    )}
                  </button>
                </div>
                {currentItems.map((sale) => (
                  <div key={sale._id} className="border-b last:border-b-0">
                    <div
                      className="p-2 flex justify-between items-center"
                      onClick={() => toggleExpandSale(sale._id)}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-xs">{sale.customerName || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">
                              {sale.saleDate ? format(new Date(sale.saleDate), 'MMM dd, h:mm a') : 'Unknown date'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-xs">{formatCurrency(sale.total)}</p>
                            <p className={`text-xs ${(sale.totalProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(sale.totalProfit)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <EllipsisVerticalIcon className="h-4 w-4 text-gray-400 ml-2" />
                    </div>
                    {expandedSale === sale._id && (
                      <div className="p-2 pt-0 bg-gray-50">
                        <div className="text-xs mb-1">
                          <span className="font-medium">Phone:</span> {sale.customerPhone || 'None'}
                        </div>
                        <div className="text-xs mb-1">
                          <span className="font-medium">Products ({sale.products?.length || 0}):</span>
                          <ul className="mt-1 pl-3 list-disc">
                            {sale.products?.map((product, idx) => (
                              <li key={idx}>
                                {product.name} - {formatCurrency(product.sellingPrice)} x {product.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {sale.discount > 0 && (
                          <div className="text-xs text-green-600">
                            {sale.discount}% discount applied
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination - Optimized for very small screens */}
          {filteredSales.length > 0 && (
            <div className="px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 flex flex-wrap items-center justify-between border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-2 sm:mb-0 w-full sm:w-auto text-center sm:text-left">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedSales.length)} of {sortedSales.length}
              </div>
              <div className="flex gap-1 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-1 sm:px-2 py-1 border rounded text-xs disabled:bg-gray-100 disabled:text-gray-400"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-1 sm:px-2 py-1 border rounded text-xs disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Prev
                </button>
                <span className="px-1 sm:px-2 py-1 text-xs">
                  {currentPage}/{totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-1 sm:px-2 py-1 border rounded text-xs disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-1 sm:px-2 py-1 border rounded text-xs disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;