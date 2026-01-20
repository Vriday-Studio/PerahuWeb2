// adminpage/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type UserData = {
  Nama: string;
  skor: number;
  Email: string;
};

const AdminPage = () => {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const fetchData = async () => {
    // In a real application, you would fetch data from an API here.
    // For this example, we'll use dummy data.
    const dummyData = {
      Nama: "John Doe",
      skor: 100,
      Email: "john.doe@example.com",
    };
    setUserData(dummyData);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-dark-blue text-white">
          <div className="px-6 py-8">
            <h2 className="text-lg font-semibold">Admin</h2>
            <p className="mt-1 text-sm text-white/70">Dashboard</p>
          </div>
        </aside>

        <main className="flex-1 bg-white">
          <div className="mx-auto max-w-3xl px-6 py-8">
            <h1 className="text-2xl font-semibold">Admin Page</h1>
            <p className="mt-2 text-slate-600">Enter User ID to view data:</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <input
                type="text"
                value={userId}
                onChange={handleInputChange}
                placeholder="User ID"
                className="w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
              />
              <button
                onClick={fetchData}
                className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
              >
                Get User Data
              </button>
            </div>

            {userData && (
              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-lg font-semibold">User Data:</h2>
                <p className="mt-2">Name: {userData.Nama}</p>
                <p>Score: {userData.skor}</p>
                <p>Email: {userData.Email}</p>
              </div>
            )}
            <button
              onClick={() => router.push("/")}
              className="mt-6 inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              Go to Home
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
