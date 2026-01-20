import React, { useEffect, useMemo, useState } from "react";
import { getTodayServerFromStartNovember } from "@/lib/firebase/todayServer";
import { getPopularMerchandise, getRedeemCodeCount } from "@/lib/firebase/redeemCode";
import { getAllArtworks } from "@/lib/firebase/artwork";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
    const today = new Date();
    today.setUTCDate(today.getUTCDate() - 7);
    today.setUTCHours(0, 0, 0, 0); 
    const sevenDaysAgo = today.toISOString();
    
    const [data, setData] = useState([]);
    const [popularMerch, setPopularMerch] = useState([]);
    const [stats, setStats] = useState({ artworks: 0, redemptions: 0 });
    const [startDate, setStartDate] = useState(sevenDaysAgo);
    const [endDate, setEndDate] = useState(new Date().toISOString());
    const [type, setType] = useState("user-login");

    const chartData = useMemo(() => {
        const labels = data.map((item) => item.label);
        const values = data.map((item) => item.value);
        return {
            labels,
            datasets: [
                {
                    label: "Count",
                    data: values,
                    backgroundColor: "#3B82F6",
                    borderColor: "#2563EB",
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                },
            ],
        };
    }, [data]);

    const chartOptions = useMemo(
        () => ({
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.1)' },
                    ticks: { color: '#374151' },
                },
                x: {
                    grid: { color: 'rgba(0,0,0,0.1)' },
                    ticks: { color: '#374151' },
                },
            },
        }),
        []
    );

    const merchChartData = useMemo(() => {
        const labels = popularMerch.map((item) => item.name);
        const values = popularMerch.map((item) => item.count);
        return {
            labels,
            datasets: [
                {
                    label: "Redemptions",
                    data: values,
                    backgroundColor: "#10B981",
                    borderColor: "#059669",
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                },
            ],
        };
    }, [popularMerch]);

    const merchChartOptions = useMemo(
        () => ({
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.1)' },
                    ticks: { color: '#374151' },
                },
                y: {
                    grid: { color: 'rgba(0,0,0,0.1)' },
                    ticks: { color: '#374151' },
                },
            },
        }),
        []
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const adjustedEndDate = new Date(endDate);
                adjustedEndDate.setHours(23, 59, 59, 999);

                const countTitle = {
                    artwork: "scan",
                    "user-login": "login",
                };

                const dataTodayServer = await getTodayServerFromStartNovember(adjustedEndDate.toISOString(), startDate);
                const mappedData = (Array.isArray(dataTodayServer) ? dataTodayServer : []).map((item) => {
                    const date = new Date(item.date);
                    const countItem = item?.count?.[countTitle[type]] ?? 0;
                    const label = date.toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    });
                    return { label, value: countItem };
                });
                setData(mappedData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [startDate, endDate, type]);

    useEffect(() => {
        const fetchPopularMerch = async () => {
            try {
                const merchData = await getPopularMerchandise();
                setPopularMerch(merchData);
                const artworks = await getAllArtworks();
                const redemptions = await getRedeemCodeCount();
                setStats({ artworks: artworks.length, redemptions });
            } catch (error) {
                console.error(error);
            }
        };
        fetchPopularMerch();
    }, []);

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    const tableTitle = {
        artwork: "Artwork Scan",
        "user-login": "User Login",
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="w-full">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Artworks</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.artworks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.redemptions}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Period</p>
                                <p className="text-lg font-semibold text-gray-900">7 Days</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Top Merchandise</p>
                                <p className="text-lg font-semibold text-gray-900">{popularMerch[0]?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">{tableTitle[type]} Trends</h2>
                            <div className="flex gap-3">
                                <select id="type" className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none" value={type} onChange={handleTypeChange}>
                                    <option value="artwork">Artwork</option>
                                    <option value="user-login">User Login</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-4 flex gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="startDate" className="text-xs font-medium text-gray-600 mb-1">
                                    Start Date
                                </label>
                                <input type="date" id="startDate" value={startDate.split("T")[0]} onChange={handleStartDateChange} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="endDate" className="text-xs font-medium text-gray-600 mb-1">
                                    End Date
                                </label>
                                <input type="date" id="endDate" value={endDate.split("T")[0]} onChange={handleEndDateChange} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none" />
                            </div>
                        </div>
                        <div className="h-96">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Popular Merchandise</h2>
                        <div className="h-96">
                            <Bar data={merchChartData} options={merchChartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
