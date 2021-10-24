import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Flex } from '@chakra-ui/layout';
import { InputField } from '../components/InputField';
import { Button } from '@chakra-ui/button';
import NextLink from 'next/link';
import router from 'next/router';
import axios from 'axios';
import { FormWrapper } from '../components/FormWrapper';
import { useQueryClient } from 'react-query';
import { useToast } from '@chakra-ui/toast';
import { validateInputLogin } from '../utils/validateInputLogin';

const Login:React.FC<{}> = () => {

    const queryClient = useQueryClient()

    const toast = useToast()

    const login = async (values:any) => {
        const res = axios.post('http://localhost:3001/login', {values}, {
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

    return (
        <FormWrapper>
            <Formik
                initialValues={{usernameOrEmail: '', password: ''}}
                onSubmit={async (values) => {
                    const validation = validateInputLogin(values)
                    if(validation !== "") {
                        toast({
                            title: validation,
                            status: 'error',
                            isClosable: true,
                        })
                    } else {
                        const res = await login(values)
                        if(res) {
                            queryClient.invalidateQueries("fetchMe")
                            router.push("/")
                        }
                    }
                }}
                >
                {({isSubmitting}) => (
                    <Form>
                    <InputField name="usernameOrEmail" placeholder="username or email" label="Username or Email" />
                    <Box mt={4}>
                        <InputField name="password" placeholder="password" label="Password" type={"password"} />
                    </Box>
                    <Flex mt={5}>
                        <Button type="submit" colorScheme="teal" mt={5} isLoading={isSubmitting} mr={"auto"}>Login</Button>
                        <NextLink href="/register">
                            <Button colorScheme="teal" mt={5}>No Account? Register here</Button>
                        </NextLink>
                    </Flex>
                </Form>
                )}
            </Formik>
        </FormWrapper>
    )
}
export default Login;