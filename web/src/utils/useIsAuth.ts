import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

export const useIsAuth = () => {
    const fetchMe = async () => {
        const {data} = await axios.get('http://localhost:3001/me', {
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