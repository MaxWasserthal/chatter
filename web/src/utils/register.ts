import { useToast } from "@chakra-ui/toast"
import axios from "axios"

export const RegisterUser = async (values:any) => {

    const toast = useToast()

    const res = axios.post('http://localhost:3001/register', {values}, {
          withCredentials: true,
    })
    .catch((err) => {
        toast({
            title: err.response.data.message,
            status: 'error',
            isClosable: true,
        })
        return null
    })
    return res
}