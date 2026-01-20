import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSelectedContentSetting } from "@/lib/firebase/contentSetting";
import { adminPostForm } from "@/lib/adminClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/components/dashboard/Loading";
import BackIcon from "@/components/dashboard/BackIcon";
import RichText from "@/components/dashboard/RichText";

const CONTENT_INPUTS = [
    {
        name: "title",
        label: "Title",
        type: "text",
    },
    {
        name: "tag",
        label: "Tag",
        type: "text",
    },
    {
        name: "images",
        label: "Images",
        type: "file",
        isMultiple: true,
    },
    {
        name: "description",
        label: "Description",
        type: "wysiwyg",
    },
];

const contentSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
    description: z.string().min(3, { message: "Description must be at least 3 characters long" }),
    tag: z.string().optional(),
    images: z.any().optional(),
    status: z.boolean().optional(),
});

const ContentSettingForm = () => {
    const params = useParams();
    const router = useRouter();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const tag = Array.isArray(params?.tag) ? params.tag[0] : params?.tag;
    const type = id === "create" ? "create" : id;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm({
        resolver: zodResolver(contentSchema),
        defaultValues: {
            status: true,
        },
    });

    const [submitMessage, setSubmitMessage] = React.useState("");
    const [submitError, setSubmitError] = React.useState("");
    const watchImages = watch("images");

    const getContentSettingById = async (id) => {
        try {
            const content = await getSelectedContentSetting({ data: { tag, id } });
            Object.keys(content).forEach((key) => {
                setValue(key, content[key]);
            });
        } catch (error) {
            console.log("Error getting content setting by id: ", error);
        }
    };

    useEffect(() => {
        if (tag === "guide") setValue("tag", "guide");
        if (type !== "create" && id) {
            getContentSettingById(id);
        }
    }, [id, tag, type]);

    const onSubmit = async (data) => {
        try {
            setSubmitMessage("");
            setSubmitError("");
            if (!id || !tag) {
                setSubmitError("Missing tag or id.");
                return;
            }

            const formData = new FormData();
            formData.append("mode", type === "create" ? "create" : "update");
            formData.append("paramTag", tag);
            formData.append("id", id);
            formData.append("title", data.title || "");
            formData.append("description", data.description || "");
            formData.append("status", String(Boolean(data.status)));
            formData.append("tag", data.tag || tag);

            if (data.images instanceof FileList) {
                Array.from(data.images).forEach((file) => formData.append("images", file));
            } else if (Array.isArray(data.images)) {
                formData.append("existingImages", JSON.stringify(data.images));
            }

            const result = await adminPostForm("/api/admin/content", formData);

            setSubmitMessage(
                type === "create"
                    ? `Saved to database. New ID: ${result?.id || "-"}`
                    : "Saved to database."
            );
            router.push(`/dashboard/${tag}`);
        } catch (error) {
            console.log("Error saving content setting: ", error);
            const message = error?.message || "Failed to save. Check console for details.";
            setSubmitError(message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-6xl mx-auto">
                <form className="bg-white shadow-lg rounded-lg p-8 flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                    <BackIcon iconColor="black" />
                    <div className="space-y-6">
                    {CONTENT_INPUTS.map((input) => (
                        <div key={input.name} className="flex flex-col gap-3">
                            <label className="text-gray-700 font-semibold">{input.label}</label>
                            <div className="flex items-center gap-2">
                                {input.icon}

                                {input.type === "textarea" && (
                                    <textarea
                                        id={input.name}
                                        placeholder={input.label}
                                        {...register(input.name)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none h-24 resize-none transition-colors"
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
                                        multiple={input.isMultiple}
                                    />
                                )}
                                {input.type === "text" && (
                                    <input
                                        id={input.name}
                                        type={input.type}
                                        {...register(input.name)}
                                        disabled={isSubmitting || (input.name === "tag" && type !== "create") || (tag === "guide" && input.name === "tag")}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                                        placeholder={input.label}
                                    />
                                )}
                                {input.type === "wysiwyg" && (
                                    <RichText
                                        name={input.name}
                                        setFieldValue={setValue}
                                        inputLabel={input.label}
                                        value={watch(input.name)}
                                    />
                                )}
                            </div>
                            {errors[input.name] && <p className="text-sm text-red-600 mt-2 font-medium">{errors[input.name].message}</p>}
                        </div>
                    ))}

                    <div className="flex items-center gap-3">
                        <input
                            id="status"
                            type="checkbox"
                            {...register("status")}
                            disabled={isSubmitting}
                            className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            defaultChecked
                        />
                        <label htmlFor="status" className="text-gray-700 font-semibold">
                            Published
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {watchImages &&
                        Array.from(watchImages).map((image, index) => (
                            <img key={index} src={watchImages instanceof FileList ? URL.createObjectURL(image) : image} alt="preview" className="w-full h-32 object-cover rounded-lg shadow-md" />
                        ))}
                </div>
                <button
                    className="w-full max-w-xs mx-auto rounded-lg bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 transition-colors shadow-md"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Loading /> : `Submit`}
                </button>
                {submitMessage && <p className="text-sm text-green-600 text-center">{submitMessage}</p>}
                {submitError && <p className="text-sm text-red-600 text-center">{submitError}</p>}
                </form>
            </div>
        </div>
    );
};

export default ContentSettingForm;
