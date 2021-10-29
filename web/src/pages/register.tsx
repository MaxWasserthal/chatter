import { Button } from '@chakra-ui/button';
import { Box, Flex } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from '../components/InputField';
import router from 'next/router';
import { RegisterUser } from '../utils/register';
import { FormWrapper } from '../components/FormWrapper';
import { useQueryClient } from 'react-query';
import { useToast } from '@chakra-ui/toast';
import { validateInputRegister } from '../utils/validateInputRegister';

// page to register for a new account
const Register: React.FC<{}> = () => {

    const queryClient = useQueryClient()
    const toast = useToast()

    return (
        <FormWrapper>
            <Formik
                initialValues={{email: '', username: '', password: '', telephone: '', description: ''}}
                onSubmit={async (values) => {
                    const validation = validateInputRegister(values)
                    if(validation !== "") {
                        toast({
                            title: validation,
                            status: 'error',
                            isClosable: true,
                        })
                    } else {
                        const res = await RegisterUser(values)
                        if(res) {
                            await queryClient.invalidateQueries("fetchMe")
                            router.replace("/")
                        }
                    }
                }}>
                {({isSubmitting}) => (
                    <Form>
                        <InputField name="username" placeholder="username" label="Username" />
                        <Flex mt={4}>
                            <InputField name="email" placeholder="email" label="Email" type={"email"} />
                            <InputField name="telephone" placeholder="telephone" label="Telephone" />
                        </Flex>
                        <Box mt={4}>
                            <InputField name="password" placeholder="password" label="Password" type={"password"} />
                        </Box>
                        <Box mt={4}>
                            <InputField textarea={true} name="description" placeholder="description" label="Description" />
                        </Box>
                        <Button type="submit" colorScheme="teal" mt={5} isLoading={isSubmitting}>Register</Button>
                    </Form>
                )}
            </Formik>
        </FormWrapper>
    )
}

export default Register;