import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Table } from "@/components/dashboard/Table";
import BackIcon from "@/components/dashboard/BackIcon";
import { timeFormat } from "@/lib/utils";
import { getQuizListUser } from "@/lib/firebase/quiz";

const QuizListUser = () => {
    const params = useParams();
    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getDetail = async (id) => {
        try {
            const users = await getQuizListUser(id);
            setUser(Object.values(users));
            setIsLoading(false);
        } catch (error) {
            console.log("Error getting quiz setting by id: ", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
        if (id) {
            getDetail(id);
        }
    }, [params]);

    return (
        <div className="p-5">
            <BackIcon />
            <h1 className="text-2xl font-bold mb-5">List User Quiz</h1>
            <Table
                cols={[
                    { id: "point", header: "Points" },
                    { id: "Nama", header: "Nama" },
                    { id: "Email", header: "Email" },
                    { id: "solvedAt", header: "Solved At", cell: ({row}) => <p>{timeFormat("id",row.original.solvedAt)}</p> },
                ]}
                data={user}
                loading={isLoading}
                rowCount={user.length}
                hideAction
            />
        </div>
    );
};

export default QuizListUser;
