import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from '../components/InputField';
import router from 'next/router';
import axios from 'axios';
import { FormWrapper } from '../components/FormWrapper';
import { useQueryClient } from 'react-query';

const Register: React.FC<{}> = () => {

    const queryClient = useQueryClient()

    const register = async (values:any) => {
        axios.post('http://localhost:3001/register', {values}, {
              withCredentials: true,
          })
    }

    return (
        <FormWrapper>
            <Formik
                initialValues={{email: '', username: '', password: ''}}
                onSubmit={async (values) => {
                    await register(values)
                    await queryClient.invalidateQueries("fetchMe")
                    router.replace("/")
                }}>
                {({isSubmitting}) => (
                    <Form>
                        <InputField name="username" placeholder="username" label="Username" />
                        <Box mt={4}>
                            <InputField name="email" placeholder="email" label="Email" type={"email"} />
                        </Box>
                        <Box mt={4}>
                            <InputField name="password" placeholder="password" label="Password" type={"password"} />
                        </Box>
                        <Button type="submit" colorScheme="teal" mt={5} isLoading={isSubmitting}>Register</Button>
                    </Form>
                )}
            </Formik>
        </FormWrapper>
    )
}

export default Register;