import React from "react";
import { getAllArtworks, getArtworkCount } from "@/lib/firebase/artwork";
import { adminPostForm } from "@/lib/adminClient";
import DataTable from "@/components/dashboard/DataTable";
import { filterStringFromHtmlTag } from "@/lib/utils";

const Artwork = () => {
    return (
        <DataTable
            fetchData={getAllArtworks}
            fetchCount={getArtworkCount}
            deleteAction={async (id) => {
                const formData = new FormData();
                formData.append("mode", "delete");
                formData.append("id", String(id));
                await adminPostForm("/api/admin/artwork", formData);
            }}
            confirmationMessage={`Are you sure you want to delete this artwork?`}
            columns={[
                {
                    id: "image",
                    header: "Image",
                    cell: ({ row }) => <img src={row.original.image} alt={`Content`} className="w-16 h-16 object-cover rounded" />,
                },
                { id: "title", header: "Title" },
                { id: "usersCount", header: "Users" },
                { id: "description", header: "Description", cell: ({ row }) => {
                    const desc = filterStringFromHtmlTag(row.original.description);
                    return <div className="max-w-xs truncate" title={desc}>{desc.length > 50 ? `${desc.substring(0, 50)}...` : desc}</div>;
                } },
                { id: "index", header: "Index", cell: ({ row }) => `${row.original.startAtIndex} - ${row.original.endAtIndex}` },
                { id: "status", header: "Status", cell: ({ row }) => (row.original.status ? "Published" : "Draft") },
            ]}
            userList
        />
    );
};

export default Artwork;
