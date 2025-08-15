import React, { useState, useEffect, use } from 'react';
import { Link } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import axios from 'axios';
import { 
    ShoppingBagIcon, 
    UserGroupIcon, 
    TruckIcon, 
    CurrencyDollarIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowRightIcon
} from "@heroicons/react/24/outline";

const Home = () => {
    const { user } = use(AuthContext);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        products: 0,
        employees: 0,
        suppliers: 0,
        totalSales: 0,
        salesAmount: 0
    });

    // Fetch all stats
    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.email) return;
            
            setLoading(true);
            try {
                // Fetch products count
                const productsResponse = await fetch(`http://localhost:5000/products/${user.email}`);
                const productsData = await productsResponse.json();
                
                // Fetch employees count
                const employeesResponse = await axios.get(`http://localhost:5000/employees/${user.email}`);
                
                // Fetch suppliers count
                const suppliersResponse = await axios.get(`http://localhost:5000/suppliers/${user.email}`);
                
                // Fetch sales data
                const salesResponse = await fetch(`http://localhost:5000/sales/${user.email}`);
                const salesData = await salesResponse.json();
                
                // Calculate total sales amount
                const totalSalesAmount = salesData.reduce((sum, sale) => sum + (sale.total || 0), 0);
                
                setStats({
                    products: productsData.length || 0,
                    employees: employeesResponse.data.length || 0,
                    suppliers: suppliersResponse.data.length || 0,
                    totalSales: salesData.length || 0,
                    salesAmount: totalSalesAmount || 0
                });
                
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchStats();
    }, [user?.email]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Welcome back! Here's an overview of your shop statistics.
                    </p>
                </div>
                
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Products Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                    <ShoppingBagIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">
                                                {loading ? '...' : stats.products}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                            <div className="text-sm">
                                <Link to="/products" className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-between">
                                    View all products
                                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Employees Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                    <UserGroupIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Employees</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">
                                                {loading ? '...' : stats.employees}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                            <div className="text-sm">
                                <Link to="/employee" className="font-medium text-green-600 hover:text-green-500 flex items-center justify-between">
                                    View all employees
                                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Suppliers Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                                    <TruckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Suppliers</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">
                                                {loading ? '...' : stats.suppliers}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                            <div className="text-sm">
                                <Link to="/suppliers" className="font-medium text-purple-600 hover:text-purple-500 flex items-center justify-between">
                                    View all suppliers
                                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sales Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-amber-500 rounded-md p-3">
                                    <CurrencyDollarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">
                                                {loading ? '...' : stats.totalSales}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {loading ? '...' : formatCurrency(stats.salesAmount)}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                            <div className="text-sm">
                                <Link to="/sales" className="font-medium text-amber-600 hover:text-amber-500 flex items-center justify-between">
                                    View sales report
                                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Quick Actions Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Link to="/add-product" className="bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors duration-200">
                            <ShoppingBagIcon className="h-8 w-8 text-blue-500 mb-2" />
                            <span className="text-sm font-medium text-gray-900">Add New Product</span>
                        </Link>
                        
                        <Link to="/add-sale" className="bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors duration-200">
                            <ClipboardDocumentListIcon className="h-8 w-8 text-green-500 mb-2" />
                            <span className="text-sm font-medium text-gray-900">Create New Sale</span>
                        </Link>
                        
                        <Link to="/sales" className="bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors duration-200">
                            <ChartBarIcon className="h-8 w-8 text-amber-500 mb-2" />
                            <span className="text-sm font-medium text-gray-900">View Sales Report</span>
                        </Link>
                        
                        <Link to="/products" className="bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors duration-200">
                            <ArrowTrendingUpIcon className="h-8 w-8 text-purple-500 mb-2" />
                            <span className="text-sm font-medium text-gray-900">Manage Inventory</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;