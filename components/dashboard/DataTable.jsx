import React, { useEffect, useState, useRef } from "react";
import { Table } from "./Table";
import ModalConfirmation from "./ModalConfirmation";
import { usePagination } from "@/lib/usePagination";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DataTable = ({
    fetchData,
    fetchCount,
    searchAction,
    searchPlaceholder,
    columns,
    deleteAction,
    userList,
    confirmationMessage,
    isRefetch,
    customAddData,
    canAddData = true,
    canEditData = true,
    customEditData,
    hideAction = false,
    hasPagination = false,
    searchType = "default",
}) => {
    const [data, setData] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const modalRef = useRef(null);
    const { onPaginationChange, pagination } = usePagination();
    const pathname = usePathname();

    const handleDelete = (item) => {
        setSelectedItem(item);
        modalRef.current.showModal();
    };

    const confirmDelete = async () => {
        if (deleteAction && selectedItem) {
            await deleteAction(selectedItem.id);
            fetchDataAndCount();
        }
        modalRef.current.close();
    };

    const fetchDataAndCount = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const totalCount = await fetchCount();
            const items = totalCount > 0 ? await fetchData(pagination.pageSize) : [];
            setRowCount(totalCount || 0);
            setData(items || []);
        } catch (err) {
            console.error("Error fetching table data", err);
            setError("Gagal mengambil data. Coba refresh halaman.");
            setRowCount(0);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDataAndCount();
    }, [pagination, pathname, isRefetch]);

    const handleSearch = async () => {
        if (searchTerm.trim() === "") {
            fetchDataAndCount(); // Reset data ketika search term kosong
        } else {
            setIsLoading(true);
            setError(null);
            try {
                const results = await searchAction(searchTerm); // Panggil function pencarian
                if (results) {
                    setData([results]);
                } else {
                    setData([]);
                }
            } catch (err) {
                console.error("Error searching data", err);
                setError("Pencarian gagal. Coba lagi.");
                setData([]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const SEARCH_CONFIG = {
        uppercase: {
            className: "uppercase",
            onChange: (e) => setSearchTerm(e.target.value.toUpperCase()),
        },
        lowercase: {
            className: "lowercase",
            onChange: (e) => setSearchTerm(e.target.value.toLowerCase()),
        },
        default: {
            className: "",
            onChange: (e) => setSearchTerm(e.target.value),
        },
    };

    return (
        <div className="w-full max-w-none p-4 sm:p-6">
            {canAddData && !customAddData && (
                <Link href={`${pathname}/create`} className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 inline-block">
                    Add Data
                </Link>
            )}
            {customAddData && customAddData}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            {searchAction && (
                <div className="flex flex-col gap-2 my-4 sm:flex-row">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className={`${SEARCH_CONFIG[searchType].className} w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none`}
                        value={searchTerm}
                        onChange={SEARCH_CONFIG[searchType].onChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />
                    <button className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 sm:w-auto" onClick={handleSearch}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 50 50" fill="white">
                            <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z" />
                        </svg>
                    </button>
                </div>
            )}

            <Table
                cols={columns}
                data={data}
                loading={isLoading}
                onPaginationChange={onPaginationChange}
                rowCount={rowCount}
                pagination={pagination}
                hasPagination={hasPagination}
                handleDelete={handleDelete}
                deleteAction={deleteAction}
                canEditData={canEditData}
                customEditData={customEditData}
                userList={userList}
                hideAction={hideAction}
            />

            {deleteAction && (
                <ModalConfirmation ref={modalRef} message={confirmationMessage} onConfirm={confirmDelete} onCancel={() => modalRef.current.close()} />
            )}
        </div>
    );
};

export default DataTable;
