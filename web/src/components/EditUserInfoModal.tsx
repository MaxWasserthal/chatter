import { Button } from '@chakra-ui/button'
import { DeleteIcon } from '@chakra-ui/icons'
import { Flex } from '@chakra-ui/layout'
import { ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '@chakra-ui/modal'
import { useToast } from '@chakra-ui/toast'
import axios from 'axios'
import { Form, Formik } from 'formik'
import router from 'next/router'
import React from 'react'
import { useQueryClient } from 'react-query'
import { InputField } from './InputField'

interface Member {
    id: number;
    username: string;
    email: string;
    description: string;
    telephone: string;
}

interface Props {
    onClose: () => void;
    user: Member;
}

export const EditUserInfoModal: React.FC<Props> = ({onClose, user}) => {

    const toast = useToast()
    const queryClient = useQueryClient()

    const saveUserInfo = async (values:any) => {
        const res = await axios.put("http://localhost:3001/me", {values}, {
            withCredentials: true,
        })
        .catch((err) => {
            toast({
                title: err.response.data.message,
                status: 'error',
                isClosable: true,
            });
            return null
        })
        return res
    }

    const deleteAccount = async () => {
        await axios.delete('http://localhost:3001/me', {
            withCredentials: true,
        })
        .then(async () => {
            await queryClient.invalidateQueries("fetchMembers")
            await queryClient.invalidateQueries("fetchMe")
            onClose()
            router.push("/register")
        })
    }

    return (
        <ModalContent>
            <ModalHeader>Edit user information</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <Formik
                    initialValues={{username: user.username, email: user.email, description: user.description, telephone: user.telephone}}
                    onSubmit={async (values) => {
                        if(values.username !== '' && values.email !== '') {
                            const res = await saveUserInfo(values)
                            if(res) {
                                await queryClient.invalidateQueries('fetchMe')
                                onClose()
                            }
                        } else if(values.username === '') {
                            toast({
                                title: "Enter a username",
                                status: 'error',
                                isClosable: true,
                            });
                        } else {
                            toast({
                                title: "Enter an email address",
                                status: 'error',
                                isClosable: true,
                            });
                        }
                    }}>
                    {({isSubmitting}) => (
                        <Form>
                            <InputField name="username" label={"Username"} placeholder={user.username}/>
                            <InputField name="email" label={"Email"} placeholder={user.email}/>
                            <InputField name="telephone" label={"Telephone"} placeholder={user.telephone}/>
                            <InputField textarea={true} name="description" label={"Description"} placeholder={user.description}/>
                            <Flex>
                                <Button mt={5} mr={"auto"} type={"submit"} colorScheme={"teal"} isLoading={isSubmitting}>Save</Button>
                                <Button mt={5} aria-label={"delete"} rightIcon={<DeleteIcon/>} color={"red"}
                                onClick={deleteAccount}>Delete Account</Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </ModalBody>
        </ModalContent>
    )
}