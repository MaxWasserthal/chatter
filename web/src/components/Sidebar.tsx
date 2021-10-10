import { Button } from '@chakra-ui/button'
import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/layout'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

interface Room {
    id: number;
    title: string;
    public: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default function Sidebar() {

    const [rooms, setRooms] = useState<Room[]>([])

    const getRooms = async () => {
        axios.get<Room[]>('http://localhost:3001/rooms', {
            withCredentials: true,
        })
        .then((response) => {
            setRooms(response.data)
        })
    }

    if(rooms.length === 0) {
        getRooms();
    }

    useEffect(() => {}, [rooms])

    return (
        <Box p={5} w="15%" pos="fixed">
            <Heading size="lg" mb={5}>Rooms</Heading>
            <UnorderedList styleType={'none'} m={0}>
            {rooms.length > 0 ? rooms.map((room) => {
                return <ListItem mb={3} p={0} key={room.id}>
                        <Button w={40}>{room.title}</Button>
                    </ListItem>
            }) : null }
            </UnorderedList>
        </Box>
    )
}
