import React, { useCallback } from 'react'
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/button'
import axios from 'axios'
import { useQuery, useQueryClient } from 'react-query'
import { Box, Flex, Stack } from '@chakra-ui/layout'
import { Form, Formik } from 'formik'
import { InputField } from './InputField'

interface Member {
    id: number;
    username: string;
}

interface Message {
    id: number;
    content: String;
    creator: Member;
    room: number;
    createdAt: Date;
}

interface Props {
    messageId: number;
    roomId: number;
}

export const DrawerContents: React.FC<Props> = ({messageId, roomId}) => {

    const queryClient = useQueryClient()

    const setRef = useCallback((node:any) => {
        if(node){
            node.scrollIntoView({ smooth: true })
        }
    }, [])

    const fetchResponses = async () => {
        const {data} = await axios.get<Message[]>('http://localhost:3001/responses', {
            withCredentials: true,
            params: {
                roomId: roomId,
                messageId: messageId,
            }
        })
        return data
    }

    const sendResponse = async (response:any) => {
        await axios.post('http://localhost:3001/responses', { response }, {
            withCredentials: true,
            params: {
                roomId: roomId,
                messageId: messageId,
            }
        })
    }

    const { data:responses } = useQuery('fetchResponses', fetchResponses)

    return (
        <>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Thread</DrawerHeader>
                <DrawerBody>
                    <Stack>
                        { responses ? responses.map((response) => {
                            return (
                                <Box pb={3}
                                key={response.id}
                                ref={response.id === responses[responses.length-1].id ? setRef : null}>
                                <Box display={"flex"}>
                                    <Text fontSize="s" pr={2} fontWeight={"bold"} lineHeight={"25px"}>{response.creator.username}</Text>
                                    <Text fontSize="xs" lineHeight={"25px"}>{response.createdAt.toString().split("T")[1].split(".")[0]}</Text>
                                </Box>
                                <Box p={2} borderRadius={5} color={"#fff"} bg={'teal'}>
                                { response.content.split("\n").map((line, idx) => {
                                    return (
                                        <Text key={idx}>{line}</Text>
                                    )
                                })}
                                </Box>
                                </Box>
                            )
                            })
                        : null }
                    </Stack>
                </DrawerBody>
                <DrawerFooter>
                    <Formik
                        initialValues={{content: ''}}
                        onSubmit={async (values, {resetForm}) => {
                            if(values.content !== '') {
                                await sendResponse(values)
                                await queryClient.invalidateQueries('fetchResponses')
                                await queryClient.invalidateQueries('fetchMessages')
                                resetForm()
                            }
                        }}>
                        {({isSubmitting}) => (
                            <Form>
                                <Flex>
                                    <InputField textarea={true} name="content" placeholder={"respond"}/>
                                    <Button type={"submit"} colorScheme={"teal"} isLoading={isSubmitting}>Send</Button>
                                </Flex>
                            </Form>
                        )}
                    </Formik>
                </DrawerFooter>
            </DrawerContent>
        </>
    )
}