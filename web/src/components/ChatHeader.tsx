import { Button, IconButton } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'
import Icon from '@chakra-ui/icon'
import { Flex, Heading } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import axios from 'axios'
import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useQuery, useQueryClient } from 'react-query'
import { Form, Formik } from 'formik'
import { InputField } from './InputField'
import CustomSelect from './CustomSelect'
import { DeleteIcon } from '@chakra-ui/icons'
import { Tooltip } from '@chakra-ui/tooltip'

interface Props {
    roomId: number;
    username: string;
}

interface Member {
    username: string;
    id: number;
}

interface Room {
    room_id: number;
    room_title: string;
    room_public: boolean;
    member_username: string;
    members: Array<string>;
}

export const ChatHeader: React.FC<Props> = ({roomId, username}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const queryClient = useQueryClient()

    const fetchRoomInfo = async () => {
        const {data} = await axios.get<Room>('http://localhost:3001/room-info', {
            withCredentials: true,
            params: {
                roomId: roomId,
            }
        })
        return data
    }

    const deleteRoom = async () => {
        await axios.delete('http://localhost:3001/rooms', {
            withCredentials: true,
            params: {
                roomId: roomId,
            }
        })
        .then(async () => {
            await queryClient.invalidateQueries("fetchRooms")
            onClose()
        })
    }

    const getMembers = async () => {
        const {data} = await axios.get<Member[]>("http://localhost:3001/members", {
            withCredentials: true,
        })
        return data;
    }

    const { data:roomInfo } = useQuery(["fetchRoomInfo", roomId], fetchRoomInfo)
    const { data:members } = useQuery("fetchMembers", getMembers)

    const memIds = roomInfo?.members.map(m => parseInt(m.split(",")[1]))

    const saveChanges = async (values:any) => {
        await axios.put("http://localhost:3001/room-info", {values}, {
            withCredentials: true,
            params: {
                roomId: roomId
            }
        })
    }

    return (
        <Flex p={3} borderBottom={"2px solid"} h={"7vh"}>
            <Heading as={"h3"} size={"l"}>{roomInfo?.room_title}</Heading>
            {roomInfo?.member_username === username ? 
                <Tooltip label={"Edit room"} placement={"bottom"} openDelay={300}>
                    <IconButton ml={1} variant={"link"} aria-label={"edit room"}
                    icon={<Icon as={BsThreeDotsVertical}/>}
                    onClick={onOpen}/>
                </Tooltip>
            : null }
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>{roomInfo?.room_title}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Formik
                            initialValues={{title: roomInfo?.room_title, members: memIds}}
                            onSubmit={async (values) => {
                                if(values.title !== '' && values.members?.length !== 0) {
                                    await saveChanges(values)
                                    await queryClient.invalidateQueries('fetchRoomInfo')
                                    await queryClient.invalidateQueries('fetchRooms')
                                    onClose()
                                }
                            }}>
                            {({isSubmitting}) => (
                                <Form>
                                    <InputField name="title" label={"title"} placeholder={roomInfo?.room_title}/>
                                    <CustomSelect name="members" label={"members"}>
                                        {members?.map((member) => {
                                            return (
                                                <option key={member.username} value={member.id}>{member.username}</option>
                                            )
                                        })}
                                    </CustomSelect>
                                    <Flex> 
                                        <Button mt={5} mr={"auto"} type={"submit"} colorScheme={"teal"} isLoading={isSubmitting}>Save</Button>
                                        <Button mt={5} aria-label={"delete"} rightIcon={<DeleteIcon/>} color={"red"}
                                        onClick={deleteRoom}>Delete</Button>
                                    </Flex>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    )
}
