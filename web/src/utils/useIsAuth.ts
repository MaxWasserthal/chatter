import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

interface Member {
    id: number;
    username: string;
    email: string;
    telephone: string;
    description: string;
}

// module to check user authentication
export const useIsAuth = () => {
    const fetchMe = async () => {
        const {data} = await axios.get<Member>('http://localhost:3001/me', {
            withCredentials: true,
        })
        return data
    }

    const { data:me, isFetched } = useQuery('fetchMe', fetchMe)
    const router = useRouter();
    useEffect(() => {
        if(isFetched && !me) {
            router.replace("/login");
            return
        }
    }, [me, isFetched, router]);

    return me
}