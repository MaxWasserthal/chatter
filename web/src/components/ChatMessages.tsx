import { Box, Flex, Stack, Text } from '@chakra-ui/layout'
import axios from 'axios'
import React, { useContext, useEffect, useCallback, useRef, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import roomContext from '../context/room'
import { Formik,Form } from 'formik'
import { Button, IconButton } from '@chakra-ui/button'
import { InputField } from './InputField'
import { useDisclosure } from '@chakra-ui/hooks'
import { Drawer } from "@chakra-ui/react"
import { ChatIcon } from '@chakra-ui/icons'
import { DrawerContents } from './DrawerContents'

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

    const { onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null)

    const [open, setOpen] = useState({
        messageId: 0,
        opened: false,
    })

    useEffect(() => {
    }, [currRoom, messages])

    const opening = (id:number) => {
        onOpen();
        setOpen({messageId: id, opened: true})
    }

    const closing = (id:number) => {
        onClose();
        setOpen({messageId: id, opened: false})
    }

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
                            <Box display={"flex"} pb={1}>
                                <Text fontSize="s" pr={2} fontWeight={"bold"} lineHeight={"25px"}>{message.creator.username}</Text>
                                <Text fontSize="xs" lineHeight={"25px"}>{message.createdAt.toString().split("T")[1].split(".")[0]}</Text>
                            </Box>
                            <Text p={2} borderRadius={5} color={"#fff"} bg={message.creator.username === me ? 'teal' : 'grey'}>{message.content}</Text>
                            <IconButton aria-label={"Respond"} ref={btnRef} onClick={() => opening(message.id)} display={'flex'} icon={<ChatIcon/>}/>
                            {open.opened && open.messageId === message.id ?
                                <Drawer isOpen={open.opened} placement={"right"} onClose={() => closing(message.id)} finalFocusRef={btnRef}>
                                <DrawerContents messageId={message.id} roomId={currRoom}/>
                                </Drawer>
                            : null}
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