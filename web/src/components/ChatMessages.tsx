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
import { useIsAuth } from '../utils/useIsAuth'
import { decrypt, encrypt } from '../utils/cryptoVals'

interface Message {
    message_id: number;
    message_content: String;
    member_username: String;
    message_roomId: number;
    message_createdAt: Date;
    responseCount: String;
    reactions: Array<String>;
}

// returns a component with every message of the current room and buttons to react, respond and send own messages
export default function ChatMessages() {

    // check if user is authenticated
    const me = useIsAuth()

    // scroll new messages into the view
    const setRef = useCallback((node:any) => {
        if(node){
            node.scrollIntoView({ smooth: true })
        }
    }, [])

    // get current roomId from context
    const {currRoom,} = useContext(roomContext)
    const queryClient = useQueryClient()

    // method for getting all messages
    const fetchMessages = async () => {
        const {data} = await axios.get<Message[]>('http://localhost:3001/messages', {
            withCredentials: true,
            params: {
                roomId: currRoom,
            }
        })
        return data
    }

    // method for sending a new message
    const sendMessage = async (message:any) => {
        await axios.post('http://localhost:3001/messages', { message }, {
            withCredentials: true,
            params: {
                roomId: currRoom,
            }
        })
    }

    // react-query to fetch messages and cache them
    const { data:messages } = useQuery(['fetchMessages', currRoom], fetchMessages)

    // use custom hook from chakra-ui to open/close sidebars
    const { onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null)

    // define state for sidebar window
    const [open, setOpen] = useState({
        messageId: 0,
        opened: false,
    })

    // define state for modal window
    const [openModal, setOpenModal] = useState({
        messageId: 0,
        opened: false,
    })

    // rerender, when current room changes or messages get updated
    useEffect(() => {
    }, [currRoom, messages])

    // abstract opening and closing methods for modal/sidebar windows
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
            {me ? <ChatHeader roomId={currRoom} username={me.username}/> : null }
            <Stack px={5} overflowY={"scroll"} h={"63vh"}>
                {messages ? messages.map((message) => {
                    let message_content = decrypt(message.message_content)
                    // check if message is from current user -> for different styling
                    let mebool = message.member_username === me!.username
                    return (
                        <Box
                        display={'flex'} flexDirection={'column'}
                        alignItems={mebool ? 'flex-end' : 'flex-start'}
                        w={"100%"} pb={2}
                        key={message.message_id}
                        ref={message.message_id === messages[messages.length-1].message_id ? setRef : null}>
                            <Box display={"flex"} pb={1}>
                                <Text fontSize="s" pr={2} fontWeight={"bold"} lineHeight={"25px"}>{message.member_username}</Text>
                                <Text fontSize="xs" lineHeight={"25px"}>{new Date(message.message_createdAt).toLocaleTimeString()}</Text>
                            </Box>
                            <Box p={2} borderRadius={5} color={"#fff"} bg={mebool ? 'teal' : 'grey'}>
                                {/* split multiline messages to individual text elements */}
                                {message_content.split("\n").map((line, idx) => {
                                    return (
                                        <Text key={idx}>{line}</Text>
                                    )
                                })}
                            </Box>
                            <Flex my={1}>
                                <Tooltip label={"React"} placement={"top"} openDelay={500}>
                                    <IconButton aria-label={"React"} mr={message.reactions ? 1 : 0} order={mebool ? 1 : 0}
                                    icon={<Icon as={BsEmojiLaughing}/>}
                                    onClick={() => openingModal(message.message_id)}/>
                                </Tooltip>
                                {/* display reactions as emoji */}
                                {message.reactions ? message.reactions.map((reaction, idx) => {
                                    return (<Button key={idx} fontSize={20} w={10} h={10}>{String.fromCodePoint(parseInt("0x"+reaction))}</Button>)
                                }) : null }
                            </Flex>
                            {/* display how many responses to the message there are */}
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
                                    <EmojiModalContents messageId={message.message_id} onClose={closingModal}/>
                                </Modal>
                            : null}
                            {/* display sidebar with responses */}
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
            {/* form to submit new messages */}
            <Box width={"97%"} mt={8}>
                <Formik
                    initialValues={{content: ''}}
                    onSubmit={async (values, {resetForm}) => {
                        if(values.content !== '') {
                            // encrypt message body before sending
                            await sendMessage(encrypt(values.content))
                            // invalidate cache of current fetched messages
                            await queryClient.invalidateQueries('fetchMessages')
                            // clear input form after sending
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