import { Box, Flex, Stack, Text } from '@chakra-ui/layout'
import axios from 'axios'
import React, { useContext, useEffect, useCallback } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import roomContext from '../context/room'
import { Formik,Form } from 'formik'
import { Button } from '@chakra-ui/button'
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
}

export default function ChatMessages() {

    const fetchMe = async () => {
        const {data} = await axios.get('http://localhost:3001/me', {
            withCredentials: true,
        })    
        return data
    }

    const { data:me } = useQuery('fetchMe', fetchMe)

    const setRef = useCallback((node:any) => {
        if(node){
            node.scrollIntoView({ smooth: true })
        }
    }, [])

    const {currRoom,} = useContext(roomContext);
    const queryClient = useQueryClient()

    const fetchMessages = async () => {
        const {data} = await axios.get<Message[]>('http://localhost:3001/messages', {
            withCredentials: true,
            params: {
                roomId: currRoom,
            }
        })
        return data
    }

    const sendMessage = async (message:any) => {
        await axios.post('http://localhost:3001/messages', { message }, {
            withCredentials: true,
            params: {
                roomId: currRoom,
            }
        })
    }

    const { data:messages } = useQuery(['fetchMessages', currRoom], fetchMessages)

    useEffect(() => {
    }, [currRoom, messages])

    return (
        <Box display={'flex'} flex={1} flexDirection={'column'} flexBasis={"80%"} pl={"2%"}>
            <Stack px={5} overflowY={"scroll"} h={"470px"}>
                {messages ? messages.map((message) => {
                    return (
                        <Box
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={message.creator.username === me ? 'flex-end' : 'flex-start'}
                        w={"100%"}
                        key={message.id}
                        ref={message.id === messages[messages.length-1].id ? setRef : null}>
                            <Text p={2} borderRadius={5} color={"#fff"} bg={message.creator.username === me ? 'teal' : 'grey'}>{message.content}</Text>
                            <Text fontSize="xs">{message.creator.username}</Text>
                        </Box>
                    )
                }) : null }
            </Stack>
            <Formik
                initialValues={{content: ''}}
                onSubmit={async (values, {resetForm}) => {
                    await sendMessage(values)
                    await queryClient.invalidateQueries('fetchMessages')
                    resetForm()
                }}>
                {({isSubmitting}) => (
                    <Form>
                        <Flex bottom={0} pos={"absolute"} w={"80%"}>
                            <InputField textarea={true} name="content" placeholder={"write something"}/>
                            <Button type={"submit"} colorScheme={"teal"} isLoading={isSubmitting}>Send</Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}