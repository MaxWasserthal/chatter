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
import { Modal } from "@chakra-ui/modal"
import { ChatIcon, Icon } from '@chakra-ui/icons'
import { DrawerContents } from './DrawerContents'
import { BsEmojiLaughing } from 'react-icons/bs'
import { EmojiModalContents } from './EmojiModalContents'
import { ChatHeader } from './ChatHeader'
import { Tooltip } from '@chakra-ui/tooltip'

interface Message {
    message_id: number;
    message_content: String;
    member_username: String;
    message_roomId: number;
    message_createdAt: Date;
    responseCount: String;
    reactions: Array<String>;
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

    const [openModal, setOpenModal] = useState({
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

    const openingModal = (id:number) => {
        onOpen();
        setOpenModal({messageId: id, opened: true})
    }

    const closingModal = (id:number) => {
        onClose()
        setOpenModal({messageId: id, opened: false})
    }

    return (
        <Box display={'flex'} flex={1} flexDirection={'column'} flexBasis={"80%"} pl={"2%"}
        position={"absolute"} right={0} width={"85%"}>
            {me ? <ChatHeader roomId={currRoom} username={me}/> : null }
            <Stack px={5} overflowY={"scroll"} h={"63vh"}>
                {messages ? messages.map((message) => {
                    let mebool = message.member_username === me;
                    return (
                        <Box
                        display={'flex'} flexDirection={'column'}
                        alignItems={mebool ? 'flex-end' : 'flex-start'}
                        w={"100%"} pb={2}
                        key={message.message_id}
                        ref={message.message_id === messages[messages.length-1].message_id ? setRef : null}>
                            <Box display={"flex"} pb={1}>
                                <Text fontSize="s" pr={2} fontWeight={"bold"} lineHeight={"25px"}>{message.member_username}</Text>
                                <Text fontSize="xs" lineHeight={"25px"}>{message.message_createdAt.toString().split("T")[1].split(".")[0]}</Text>
                            </Box>
                            <Box p={2} borderRadius={5} color={"#fff"} bg={mebool ? 'teal' : 'grey'}>
                                {message.message_content.split("\n").map((line, idx) => {
                                    return (
                                        <Text key={idx}>{line}</Text>
                                    )
                                })}
                            </Box>
                            <Flex my={1}>
                                <Tooltip label={"React"} placement={"top"} openDelay={500}>
                                    <IconButton aria-label={"React"} mr={message.reactions ? 1 : 0} order={mebool === me ? 1 : 0}
                                    icon={<Icon as={BsEmojiLaughing}/>}
                                    onClick={() => openingModal(message.message_id)}/>
                                </Tooltip>
                                {message.reactions ? message.reactions.map((reaction, idx) => {
                                    return (<Button key={idx} fontSize={20} w={10} h={10}>{String.fromCodePoint(parseInt("0x"+reaction))}</Button>)
                                }) : null }
                            </Flex>
                            {parseInt(message.responseCount as string) > 0 ?
                                    <Tooltip label={"Respond"} placement={"bottom"} openDelay={500}>
                                        <Button aria-label={"Respond"} display={'flex'}
                                        ref={btnRef}
                                        onClick={() => opening(message.message_id)} rightIcon={<ChatIcon/>}>
                                            {message.responseCount} responses
                                        </Button>
                                    </Tooltip>
                                    :
                                    <Tooltip label={"Respond"} placement={"bottom"} openDelay={500}>
                                        <IconButton icon={<ChatIcon/>} aria-label={"Respond"} display={'flex'}
                                        ref={btnRef}
                                        onClick={() => opening(message.message_id)}/>
                                    </Tooltip>
                                }
                                {openModal.opened && openModal.messageId === message.message_id ?
                                <Modal isOpen={openModal.opened} onClose={() => closingModal(message.message_id)}>
                                    <EmojiModalContents messageId={message.message_id}/>
                                </Modal>
                            : null}
                            {open.opened && open.messageId === message.message_id ?
                                <Drawer isOpen={open.opened} placement={"right"}
                                finalFocusRef={btnRef}
                                onClose={() => closing(message.message_id)}>
                                    <DrawerContents messageId={message.message_id} roomId={currRoom}/>
                                </Drawer>
                            : null}
                        </Box>
                    )
                }) : null }
            </Stack>
            <Box width={"97%"} mt={8}>
                <Formik
                    initialValues={{content: ''}}
                    onSubmit={async (values, {resetForm}) => {
                        if(values.content !== '') {
                            await sendMessage(values)
                            await queryClient.invalidateQueries('fetchMessages')
                            resetForm()
                        }
                    }}>
                    {({isSubmitting}) => (
                        <Form>
                            <Flex>
                                <InputField textarea={true} name="content" placeholder={"write something"}/>
                                <Button type={"submit"} colorScheme={"teal"} isLoading={isSubmitting}>Send</Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    )
}