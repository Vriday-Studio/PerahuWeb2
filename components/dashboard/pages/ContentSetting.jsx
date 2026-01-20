import React from "react";
import { useParams } from "next/navigation";
import { getContentSettingByTag, getContentSettingCount } from "@/lib/firebase/contentSetting";
import { adminPostForm } from "@/lib/adminClient";
import DataTable from "@/components/dashboard/DataTable";
import { filterStringFromHtmlTag } from "@/lib/utils";

const ContentSetting = () => {
    const params = useParams();
    const tag = Array.isArray(params?.tag) ? params.tag[0] : params?.tag;

    return (
        <DataTable
            fetchData={() => getContentSettingByTag(tag, "desc", false)}
            fetchCount={() => getContentSettingCount(tag)}
            deleteAction={async (id) => {
                const formData = new FormData();
                formData.append("mode", "delete");
                formData.append("paramTag", tag);
                formData.append("id", String(id));
                await adminPostForm("/api/admin/content", formData);
            }}
            confirmationMessage={`Are you sure you want to delete this data?`}
            columns={[
                { id: "title", header: "Title" },
                { id: "description", header: "Description", cell: ({ row }) => {
                    const desc = filterStringFromHtmlTag(row.original.description);
                    return <div className="max-w-xs truncate" title={desc}>{desc.length > 50 ? `${desc.substring(0, 50)}...` : desc}</div>;
                } },
                { id: "tag", header: "Tag" },
                { id: "status", header: "Status", cell: ({ row }) => (row.original.status ? "Published" : "Not Published") },
                {
                    id: "images",
                    header: "Images",
                    cell: ({ row }) =>
                        row.original.images &&
                        row.original.images.length && (
                            <div className="flex gap-2">
                                {row.original.images.slice(0, 2).map((image, index) => (
                                    <img key={index} src={image} alt={`Content`} className="w-16 h-16 object-cover rounded" />
                                ))}
                                {row.original.images.length > 2 && <span className="text-sm text-gray-500">+{row.original.images.length - 2}</span>}
                            </div>
                        ),
                },
            ]}
        />
    );
};

export default ContentSetting;
