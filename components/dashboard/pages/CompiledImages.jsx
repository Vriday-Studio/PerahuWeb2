import React, { useEffect, useState } from "react";
import UploadTab from "@/components/dashboard/compiler/UploadTab";
import useCompiler, { COMPILER_STATE } from "@/lib/useCompiler";
import DataTable from "@/components/dashboard/DataTable";
import { getAllCompiledImages, getCompiledImagesCount } from "@/lib/firebase/compiledImages";
import { adminPostForm } from "@/lib/adminClient";

const CompiledImages = () => {
    const { startCompiler, exportedBuffer, percentage, step } = useCompiler();
    const [isUploading, setIsUploading] = React.useState(false);
    const [isRefetch, setIsRefetch] = React.useState(false);
    const [isMindarReady, setIsMindarReady] = useState(false);
    const [submitError, setSubmitError] = React.useState("");

    useEffect(() => {
        let isMounted = true;
        const loadMindar = async () => {
            try {
                await import("mind-ar/dist/mindar-image.prod.js");
                if (isMounted) setIsMindarReady(true);
            } catch (error) {
                console.error("Failed to load MindAR compiler script:", error);
            }
        };

        loadMindar();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const uploadCompiledMind = async () => {
            if (!exportedBuffer) return;
            const file = new File([exportedBuffer], "targets.mind");
            const formData = new FormData();
            formData.append("mode", "upload-target");
            formData.append("target", file);
            await adminPostForm("/api/admin/compiler", formData);
        };

        if (step === COMPILER_STATE.COMPILED) {
            uploadCompiledMind();
            setIsRefetch(!isRefetch);
        }
    }, [step]);

    const handleAddCompiledImages = async (files) => {
        if (files.length === 0) {
            console.error("please select images.");
            return;
        }
        setIsUploading(true);
        setSubmitError("");

        try {
            const resetForm = new FormData();
            resetForm.append("mode", "reset");
            await adminPostForm("/api/admin/compiler", resetForm);
            localStorage.removeItem("listAssets");
            const uploadForm = new FormData();
            uploadForm.append("mode", "upload-images");
            Array.from(files).forEach((file) => uploadForm.append("images", file));
            await adminPostForm("/api/admin/compiler", uploadForm);
        } catch (error) {
            console.error("Error uploading artworks:", error);
            setSubmitError(error?.message || "Failed to upload compiled images.");
        } finally {
            setIsUploading(false);
        }
    };

    const RenderTab = () => {
        switch (step) {
            case COMPILER_STATE.IDLE:
                return (
                    <UploadTab
                        percentage={percentage}
                        onClick={(files) => {
                            startCompiler(files);
                            handleAddCompiledImages(files);
                        }}
                    />
                );
            case COMPILER_STATE.COMPILED:
                return (
                    <div className="flex flex-col mt-5 mx-10 items-center">
                        <div className="my-5 max-h-[80vh] w-full flex justify-center items-center p-6 border-2 border-dashed rounded-lg border-green-300 bg-green-50">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="mt-2 text-green-800 font-medium">Images compiled successfully!</p>
                                {isUploading && (
                                    <div className="mt-2 flex items-center space-x-2">
                                        <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="text-green-700">Uploading images...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            default:
                return <></>;
        }
    };

    if (!isMindarReady) {
        return (
            <div className="flex flex-col mt-5 mx-10 items-center">
                <div className="my-5 max-h-[80vh] w-full flex justify-center items-center p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50">
                    <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-700">Loading compiler...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mx-10 mt-6">
                {submitError && <p className="text-sm text-red-600">{submitError}</p>}
            </div>
            <RenderTab />
            {!isUploading && (
                <DataTable
                    fetchData={getAllCompiledImages}
                    fetchCount={getCompiledImagesCount}
                    hideAction
                    columns={[
                        {
                            id: "image",
                            header: "Image",
                            cell: ({ row }) => <img src={row.original.image} alt={`Content`} className="w-24 h-24 object-cover" />,
                        },
                        { id: "id", header: "Index" },
                        { id: "title", header: "Filename" },
                    ]}
                    isRefetch={isRefetch}
                    canAddData={false}
                    userList
                />
            )}
        </>
    );
};

export default CompiledImages;
