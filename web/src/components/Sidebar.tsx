import { Button } from '@chakra-ui/button'
import { Box, Heading, Stack } from '@chakra-ui/layout'
import axios from 'axios'
import React from 'react'
import {useQuery} from 'react-query'

interface Room {
    id: number;
    title: string;
    public: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default function Sidebar() {

    const fetchRooms = async () => {
        const {data} = await axios.get<Room[]>('http://localhost:3001/rooms', {
            withCredentials: true,
        })    
        return data
    }

    const { data } = useQuery('fetchRooms', fetchRooms)

    return (
        <Box px={5} w={"min-content"} h={"75%"} display={"flex"} flex={1} flexDirection={'column'} flexBasis={'20%'}>
            <Heading size="lg" mb={5}>Rooms</Heading>
            <Stack spacing={3} maxH={"520px"} px={3} overflowY={"scroll"} w={"min-content"}>
            {data ? data.map((room) => {
                return <Box key={room.id}>
                        <Button w={40}>{room.title}</Button>
                    </Box>
            }) : null }
            </Stack>
        </Box>
    )
}
