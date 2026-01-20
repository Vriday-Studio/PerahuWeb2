import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/components/dashboard/Loading";
import { getSelectedArtwork } from "@/lib/firebase/artwork";
import { adminPostForm } from "@/lib/adminClient";
import BackIcon from "@/components/dashboard/BackIcon";
import RichText from "@/components/dashboard/RichText";

const DETAIL_INPUTS = [
    {
        name: "title",
        label: "Title",
        type: "text",
    },
    {
        name: "description",
        label: "Description",
        type: "wysiwyg",
    },
    {
        name: "startAtIndex",
        label: "Start At Index",
        type: "number",
    },
    {
        name: "endAtIndex",
        label: "End At Index",
        type: "number",
    },
    {
        name: "material",
        label: "Material",
        type: "text",
    },
    {
        name: "year",
        label: "Year",
        type: "text",
    },
    {
        name: "media",
        label: "Media",
        type: "text",
    },
    {
        name: "size",
        label: "Size",
        type: "text",
    },
    {
        name: "area",
        label: "Area",
        type: "text",
    },
    {
        name: "image",
        label: "Image",
        type: "file",
    },
];

const detailSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
    description: z.string().min(3, { message: "Description must be at least 3 characters long" }),
    startAtIndex: z.string().min(1, { message: "Start At Index must be at least 1 characters long" }),
    endAtIndex: z.string().min(1, { message: "End At Index must be at least 1 characters long" }),
    material: z.string().optional(),
    year: z.string().optional(),
    media: z.string().optional(),
    size: z.string().optional(),
    area: z.string().optional(),
    status: z.boolean().optional(),
    image: z.any().optional(),
});

const ArtworkForm = () => {
    const params = useParams();
    const router = useRouter();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const type = id === "create" ? "create" : id;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(detailSchema),
    });

    const [submitMessage, setSubmitMessage] = React.useState("");
    const [submitError, setSubmitError] = React.useState("");
    const watchImages = watch("image");

    const getDetail = async (id) => {
        try {
            const content = await getSelectedArtwork(id);
            Object.keys(content).forEach((key) => {
                setValue(key, content[key]);
            });
        } catch (error) {
            console.log("Error getting content setting by id: ", error);
        }
    };

    useEffect(() => {
        if (type !== "create") {
            if (id) {
                getDetail(id);
            }
        }
    }, [id, type]);

    const onSubmit = async (data) => {
        try {
            setSubmitMessage("");
            setSubmitError("");
            const formData = new FormData();
            formData.append("mode", type === "create" ? "create" : "update");
            if (id) {
                formData.append("id", id);
            }
            formData.append("title", data.title || "");
            formData.append("description", data.description || "");
            formData.append("status", String(Boolean(data.status)));
            formData.append("area", data.area || "");
            formData.append("material", data.material || "");
            formData.append("year", data.year || "");
            formData.append("media", data.media || "");
            formData.append("size", data.size || "");
            formData.append("startAtIndex", data.startAtIndex || "");
            formData.append("endAtIndex", data.endAtIndex || "");

            if (data.image instanceof FileList) {
                const file = data.image[0];
                if (file) {
                    formData.append("image", file);
                }
            } else if (typeof data.image === "string") {
                formData.append("existingImage", data.image);
            }

            const result = await adminPostForm("/api/admin/artwork", formData);
            setSubmitMessage(
                type === "create"
                    ? `Saved to database. New ID: ${result?.id || "-"}`
                    : "Saved to database."
            );
            router.push(`/dashboard/artwork`);
        } catch (error) {
            console.log("Error updating artwork: ", error);
            setSubmitError(error?.message || "Failed to save.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-6xl mx-auto">
                <form className="bg-white shadow-lg rounded-lg p-8 flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                    <BackIcon iconColor="black" />
                    <div className="space-y-6">
                {DETAIL_INPUTS.map((input) => (
                    <div key={input.name} className="flex flex-col gap-3">
                        <label className="text-gray-700 font-semibold">{input.label}</label>
                        <div className="flex items-center gap-2">
                            {input.icon}

                            {input.type === "textarea" && (
                                <textarea id={input.name} placeholder={input.label} {...register(input.name)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none h-24 resize-none transition-colors" />
                            )}
                            {input.type === "wysiwyg" && (
                                <RichText
                                    name={input.name}
                                    setFieldValue={setValue}
                                    inputLabel={input.label}
                                    value={watch(input.name)}
                                />
                            )}
                            {input.type === "file" && (
                                <input
                                    id={input.name}
                                    type={input.type}
                                    {...register(input.name)}
                                    disabled={isSubmitting}
                                    className="w-full text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors"
                                    accept="image/*"
                                    placeholder={input.label}
                                />
                            )}

                            {["text", "number"].includes(input.type) && (
                                <input
                                    id={input.name}
                                    type={input.type}
                                    {...register(input.name)}
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                                    placeholder={input.label}
                                />
                            )}
                        </div>
                        {errors[input.name] && <p className="text-sm text-red-600 mt-2 font-medium">{errors[input.name].message}</p>}
                    </div>
                ))}

                <div className="flex items-center gap-3">
                    <input id="status" type="checkbox" {...register("status")} disabled={isSubmitting} className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2" defaultChecked />
                    <label htmlFor="status" className="text-gray-700 font-semibold">
                        Published
                    </label>
                </div>
                {watchImages && Array.from(watchImages).length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {watchImages instanceof FileList ? (
                            Array.from(watchImages).map((image, index) => (
                                <img key={index} src={URL.createObjectURL(image)} alt="preview" className="w-full h-32 object-cover rounded-lg shadow-md" />
                            ))
                        ) : (
                            <img src={watchImages} alt="preview" className="w-full h-32 object-cover rounded-lg shadow-md" />
                        )}
                    </div>
                ) : null}
            </div>
                    <button className="w-full max-w-xs mx-auto rounded-lg bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 transition-colors shadow-md" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loading /> : `Submit`}
                    </button>
                    {submitMessage && <p className="text-sm text-green-600 font-medium">{submitMessage}</p>}
                    {submitError && <p className="text-sm text-red-600 font-medium">{submitError}</p>}
                </form>
            </div>
        </div>
    );
};

export default ArtworkForm;
