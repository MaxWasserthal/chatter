import React, { useCallback } from 'react'
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/button'
import axios from 'axios'
import { useQuery, useQueryClient } from 'react-query'
import { Box, Flex, Stack } from '@chakra-ui/layout'
import { Form, Formik } from 'formik'
import { InputField } from './InputField'
import { decrypt, encrypt } from '../utils/cryptoVals'

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


// returns a sidebar for displaying responses to the current message
export const DrawerContents: React.FC<Props> = ({messageId, roomId}) => {

    const queryClient = useQueryClient()

    // scroll into view when new repsonse is sent
    const setRef = useCallback((node:any) => {
        if(node){
            node.scrollIntoView({ smooth: true })
        }
    }, [])

    // method for getting all responses to current message
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

    // method to send a new response to current message
    const sendResponse = async (response:any) => {
        await axios.post('http://localhost:3001/responses', { response }, {
            withCredentials: true,
            params: {
                roomId: roomId,
                messageId: messageId,
            }
        })
    }

    // react-query to get responses and cache them
    const { data:responses } = useQuery('fetchResponses', fetchResponses)

    return (
        <>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Thread</DrawerHeader>
                <DrawerBody>
                    <Stack>
                        {/* if there are responses, display them stacked */}
                        { responses ? responses.map((response) => {
                            return (
                                <Box pb={3}
                                key={response.id}
                                ref={response.id === responses[responses.length-1].id ? setRef : null}>
                                <Box display={"flex"}>
                                    <Text fontSize="s" pr={2} fontWeight={"bold"} lineHeight={"25px"}>{response.creator.username}</Text>
                                    <Text fontSize="xs" lineHeight={"25px"}>{new Date(response.createdAt).toLocaleTimeString()}</Text>
                                </Box>
                                {/* split multiline responses into individual text elements */}
                                <Box p={2} borderRadius={5} color={"#fff"} bg={'teal'}>
                                { decrypt(response.content).split("\n").map((line, idx) => {
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
                                await sendResponse(encrypt(values.content))
                                // fetch responses new
                                await queryClient.invalidateQueries('fetchResponses')
                                // fetch messages new -> new response count
                                await queryClient.invalidateQueries('fetchMessages')
                                // clear input field after submitting
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