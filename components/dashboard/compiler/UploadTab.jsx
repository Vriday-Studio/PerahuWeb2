import { useEffect, useMemo, useState } from "react";

const UploadTab = ({ onClick, percentage }) => {
    const [files, setFiles] = useState([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isDragAccept, setIsDragAccept] = useState(false);
    const [isDragReject, setIsDragReject] = useState(false);

    const onDrop = (event) => {
        event.preventDefault();
        const acceptedFiles = Array.from(event.dataTransfer.files);

        const handleFile = (file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

        if (acceptedFiles.length > 0) {
            setFiles(acceptedFiles.map(handleFile));
            setIsDragAccept(true);
            setIsDragReject(false);
        } else {
            setIsDragReject(true);
            setIsDragAccept(false);
        }

        setIsDragActive(false);
    };

    const onDragOver = (event) => {
        event.preventDefault();
        setIsDragActive(true);
    };

    const onDragLeave = () => {
        setIsDragActive(false);
    };

    const handleFileInput = (event) => {
        const selectedFiles = Array.from(event.target.files);

        const handleFile = (file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

        setFiles(selectedFiles.map(handleFile));
    };

    const getBorderColor = () => {
        if (isDragReject) return "border-red-400";
        if (isDragAccept) return "border-green-400";
        if (isDragActive) return "border-blue-400";
        return "border-gray-300";
    };

    const getBgColor = () => {
        if (isDragReject) return "bg-red-50";
        if (isDragAccept) return "bg-green-50";
        if (isDragActive) return "bg-blue-50";
        return "bg-gray-50";
    };

    useEffect(() => {
        return () => {
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    const ImagePreview = () => (
        <div className="grid grid-cols-4 gap-5 overflow-auto">
            {files.map((file, id) => (
                <div key={`${file.name}-${id}`} className="flex justify-center">
                    <img src={file.preview} alt={file.name} className="max-w-full h-auto" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col mt-5 mx-10 items-center">
            <div
                className={`my-5 max-h-[80vh] flex justify-center items-center p-6 border-2 border-dashed rounded-lg transition-colors duration-300 ${getBorderColor()} ${getBgColor()}`}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragLeave={onDragLeave}
            >
                {percentage === null && <input type="file" onChange={handleFileInput} multiple className="hidden" id="fileInput" />}
                <label htmlFor="fileInput">
                    {files.length === 0 ? <p>Drag and drop your target images here or click to select files.</p> : <ImagePreview />}
                </label>
            </div>
            {percentage === null ? (
                <button
                    disabled={files.length === 0}
                    onClick={() => onClick(files)}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                        files.length === 0
                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                >
                    Start Compiler
                </button>
            ) : (
                <div className="w-56">
                    <div className="bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    <p className="text-center mt-2 text-sm text-gray-600">{percentage}%</p>
                </div>
            )}
        </div>
    );
};

export default UploadTab;
