import { IconButton } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'
import Icon from '@chakra-ui/icon'
import { Flex, Heading } from '@chakra-ui/layout'
import { Modal, ModalOverlay } from '@chakra-ui/modal'
import axios from 'axios'
import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useQuery } from 'react-query'
import { Tooltip } from '@chakra-ui/tooltip'
import { RoomModalContents } from './RoomModalContents'

interface Props {
    roomId: number;
    username: string;
}

interface Room {
    room_id: number;
    room_title: string;
    room_public: boolean;
    member_username: string;
    members: Array<string>;
}

// returns a header for the current room
export const ChatHeader: React.FC<Props> = ({roomId, username}) => {

    // use custom hook from chakra-ui to open and close modals
    const { isOpen, onOpen, onClose } = useDisclosure()

    // get room info for current room
    const fetchRoomInfo = async () => {
        const {data} = await axios.get<Room>('http://localhost:3001/room-info', {
            withCredentials: true,
            params: {
                roomId: roomId,
            }
        })
        return data
    }

    // create react-query that fetches the data and caches it
    const { data:roomInfo } = useQuery(["fetchRoomInfo", roomId], fetchRoomInfo)

    // returns title and button to open a modal for editing room info
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
                <RoomModalContents onClose={onClose} roomInfo={roomInfo as Room}/>
            </Modal>
        </Flex>
    )
}
