import { Button } from "@chakra-ui/button"
import { DeleteIcon } from "@chakra-ui/icons"
import { Flex } from "@chakra-ui/layout"
import { ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "@chakra-ui/modal"
import { useToast } from "@chakra-ui/toast"
import axios from "axios"
import { Form, Formik } from "formik"
import { useContext } from 'react'
import { useQuery, useQueryClient } from "react-query"
import RoomContext from "../context/room"
import CustomSelect from "./CustomSelect"
import { InputField } from "./InputField"

interface Room {
    room_id: number;
    room_title: string;
    room_public: boolean;
    member_username: string;
    members: Array<string>;
}

interface Member {
    username: string;
    id: number;
}

interface Props {
    onClose: () => void;
    roomInfo: Room;
}

// returns a modal window for editing room information
export const RoomModalContents: React.FC<Props> = ({onClose, roomInfo}) => {

    const queryClient = useQueryClient();
    // get members of the current room
    const memIds = roomInfo.members ? roomInfo.members?.map(m => parseInt(m.split(",")[1])) : []

    const {currRoom, setRoom} = useContext(RoomContext)
    const toast = useToast()

    // method for saving the room information
    const saveRoomInfo = async (values:any) => {
        const res = await axios.put("http://localhost:3001/room-info", {values}, {
            withCredentials: true,
            params: {
                roomId: currRoom
            }
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

    const getMembers = async () => {
        const {data} = await axios.get<Member[]>("http://localhost:3001/members", {
            withCredentials: true,
        })
        return data;
    }

    const { data:members } = useQuery("fetchMembers", getMembers)

    const deleteRoom = async () => {
        await axios.delete('http://localhost:3001/rooms', {
            withCredentials: true,
            params: {
                roomId: currRoom,
            }
        })
        .then(async () => {
            await queryClient.invalidateQueries("fetchRooms")
            setRoom(1)
            onClose()
        })
    }

    return (
        <ModalContent>
            <ModalHeader>{roomInfo?.room_title}</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <Formik
                    initialValues={{title: roomInfo?.room_title, members: memIds}}
                    onSubmit={async (values) => {
                        if(values.title !== '' && values.members?.length !== 0) {
                            const res = await saveRoomInfo(values)
                            if(res) {
                                await queryClient.invalidateQueries('fetchRoomInfo')
                                await queryClient.invalidateQueries('fetchRooms')
                                onClose()
                            }
                        } else if(values.title === '') {
                            toast({
                                title: "Enter a title",
                                status: 'error',
                                isClosable: true,
                            });
                        } else {
                            toast({
                                title: "Select members",
                                status: 'error',
                                isClosable: true,
                            });
                        }
                    }}>
                    {({isSubmitting}) => (
                        <Form>
                            <InputField name="title" label={"title"} placeholder={roomInfo?.room_title}/>
                            {members ?
                            <CustomSelect name="members" label="members">
                                {members?.map((member) => {
                                    return (
                                        <option key={member.username} value={member.id}>{member.username}</option>
                                    )
                                })}
                            </CustomSelect>
                            : null }
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
    )
}