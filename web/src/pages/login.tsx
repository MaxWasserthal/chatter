import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Flex, Link } from '@chakra-ui/layout';
import { InputField } from '../components/InputField';
import { Button } from '@chakra-ui/button';
import NextLink from 'next/link';
import router from 'next/router';
import axios from 'axios';
import { FormWrapper } from '../components/FormWrapper';

const Login:React.FC<{}> = () => {

    const login = async (values:any) => {
        axios.post('http://localhost:3001/login', {values}, {
              withCredentials: true,
          })
          .then(() => {
            router.replace("/")
          })
          .catch((err:any) => {
            console.log(err);
          });
    }

    return (
        <FormWrapper>
            <Formik
                initialValues={{email: '', username: '', password: ''}}
                onSubmit={async (values) => {
                    await login(values);
                    router.push("/")
                }}
                >
                {({isSubmitting}) => (
                    <Form>
                    <InputField name="usernameOrEmail" placeholder="username or email" label="Username or Email" />
                    <Box mt={4}>
                        <InputField name="password" placeholder="password" label="Password" type={"password"} />
                    </Box>
                    <Flex>
                        <NextLink href="/">
                            <Link ml='auto'>Forgot password?</Link>
                        </NextLink>
                    </Flex>
                    <Button type="submit" colorScheme="teal" mt={5} isLoading={isSubmitting}>Login</Button>
                </Form>
                )}
            </Formik>
        </FormWrapper>
    )
}
export default Login;