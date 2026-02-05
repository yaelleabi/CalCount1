import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export type Template = {
    _id: string;
    name: string;
    calories: number;
    type: "entry" | "expense";
};

export const useTemplates = (type: "entry" | "expense") => {
    const { token } = useAuth();
    const [templates, setTemplates] = useState<Template[]>([]);

    useEffect(() => {
        if (!token) return;

        fetch(`http://localhost:3000/templates?type=${type}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setTemplates(data))
            .catch(() => setTemplates([]));
    }, [type, token]);

    return templates;
};
