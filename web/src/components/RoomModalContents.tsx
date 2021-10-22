import { Button } from "@chakra-ui/button"
import { DeleteIcon } from "@chakra-ui/icons"
import { Flex } from "@chakra-ui/layout"
import { ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "@chakra-ui/modal"
import axios from "axios"
import { Form, Formik } from "formik"
import { useQuery, useQueryClient } from "react-query"
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
    roomId: number;
    onClose: () => void;
    roomInfo: Room;
}

export const RoomModalContents: React.FC<Props> = ({roomId, onClose, roomInfo}) => {

    const queryClient = useQueryClient();
    const memIds = roomInfo?.members.map(m => parseInt(m.split(",")[1]))

    const saveRoomInfo = async (values:any) => {
        await axios.put("http://localhost:3001/room-info", {values}, {
            withCredentials: true,
            params: {
                roomId: roomId
            }
        })
    }

    const getMembers = async () => {
        const {data} = await axios.get<Member[]>("http://localhost:3001/members", {
            withCredentials: true,
        })
        return data;
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

    const { data:members } = useQuery("fetchMembers", getMembers)

    return (
        <ModalContent>
            <ModalHeader>{roomInfo?.room_title}</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <Formik
                    initialValues={{title: roomInfo?.room_title, members: memIds}}
                    onSubmit={async (values) => {
                        if(values.title !== '' && values.members?.length !== 0) {
                            await saveRoomInfo(values)
                            await queryClient.invalidateQueries('fetchRoomInfo')
                            await queryClient.invalidateQueries('fetchRooms')
                            onClose()
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