import React, { useState } from "react";
import * as XLSX from "xlsx";
import { getUsersFromStartNovember } from "@/lib/firebase/users";
import Loading from "@/components/dashboard/Loading";
import { getTodayServerFromStartNovember } from "@/lib/firebase/todayServer";

const Report = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [startDate, setStartDate] = useState("2024-11-11T00:00:00.000Z");
    const [endDate, setEndDate] = useState(new Date().toISOString());
    const [type, setType] = useState("artwork");

    const formatDate = (time) => {
        const date = new Date(time);
        const gmtTime = new Date(date.getTime() + (7 * 60 * 60 * 1000)); // Convert to GMT+7 time
        return gmtTime.toISOString().slice(0, 19).replace("T", " ");
    };

    const getDataUser = async () => {
        const users = await getUsersFromStartNovember(endDate, startDate);
        if (users.length > 0) {
            const calculateCollection = (collection) => {
                if (!Array.isArray(collection)) {
                    const mappedCollection = Object.keys(collection).map((key) => collection[key]);
                    return mappedCollection.filter((c) => c).length;
                }
                return collection.filter((c) => c).length;
            };
            const dataArray = users.map((user) => ({
                Nama: user.Nama,
                Email: user.Email,
                Collection: user.collection ? calculateCollection(user.collection) : 0,
                Points: user.quiz ? Object.values(user.quiz).reduce((acc, curr) => acc + curr, 0) : 0,
                "Last Login": formatDate(user.lastLoggedIn),
            }));
            return dataArray;
        } else {
            return [];
        }
    };

    const getDataTodayUsers = async () => {
        const data = await getTodayServerFromStartNovember(endDate, startDate);
        if (data.length > 0) {
            let dataArray = [];
            if (type === "user-login") {
                dataArray = data.flatMap((item) =>
                    item.users.map((user) => ({
                        Nama: user.Nama,
                        Email: user.Email,
                        "LoggedIn At": formatDate(user.lastLoggedIn || item.date),
                    }))
                );
            } else if (type === "artwork") {
                dataArray = data.flatMap((item) => {
                    if (!item.scan) return [];
                    return item.scan.map((scanData) => ({
                        Title: scanData.artworkTitle,
                        Nama: scanData.Nama,
                        Email: scanData.Email,
                        "Scanned At": formatDate(scanData.scannedAt),
                    }));
                });
            }
            return dataArray;
        } else {
            return [];
        }
    };

    const selectedGetDataByType = {
        artwork: getDataTodayUsers,
        user: getDataUser,
        "user-login": getDataTodayUsers,
    };

    const fetchDataAndExportToExcel = async () => {
        setLoading(true);
        try {
            const today = new Date();
            const data = await selectedGetDataByType[type]();

            if (data.length > 0) {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
                XLSX.writeFile(wb, `Report-${type}-${today.toLocaleDateString("id")}.xlsx`);
                setMessage("Data exported successfully");
            } else {
                setMessage("Data is empty");
            }
        } catch (error) {
            setError(true);
            console.error("Error fetching data: ", error);
            setMessage("Error get data");
        }
        setLoading(false);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    return (
        <div className="p-10 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Pilih Report</h1>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-slate-900 mb-2">
                                Type
                            </label>
                            <select
                                id="type"
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                                value={type}
                                onChange={handleTypeChange}
                            >
                                <option value="artwork">Artwork</option>
                                <option value="user">User</option>
                                <option value="user-login">User Login</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-slate-900 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate.split("T")[0]}
                                onChange={handleStartDateChange}
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-slate-900 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate.split("T")[0]}
                                onChange={handleEndDateChange}
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                            />
                        </div>
                    </div>
                    <button
                        disabled={loading || startDate > endDate}
                        className="w-full rounded-md bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                        onClick={fetchDataAndExportToExcel}
                    >
                        {loading ? <Loading /> : "Export"}
                    </button>
                    {message && (
                        <p className={`mt-4 text-sm ${error ? "text-red-600" : "text-green-600"}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Report;
