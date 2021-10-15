import { Button } from '@chakra-ui/button'
import { Box, Heading, Stack } from '@chakra-ui/layout'
import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import {useQuery} from 'react-query'
import roomContext from '../context/room'

interface Room {
    id: number;
    title: string;
    public: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default function Sidebar() {

    const {currRoom, setRoom} = useContext(roomContext);

    useEffect(() => {
    }, [currRoom])

    const fetchRooms = async () => {
        const {data} = await axios.get<Room[]>('http://localhost:3001/rooms', {
            withCredentials: true,
        })
        return data
    }

    const { data:rooms } = useQuery('fetchRooms', fetchRooms)

    return (
        <Box px={5} w={"min-content"} h={"75%"} display={"flex"} flex={1} flexDirection={'column'} flexBasis={'10%'} overflowY={"scroll"} overflowX={"hidden"}>
            <Heading size="lg" mb={5}>Rooms</Heading>
            <Stack spacing={3} maxH={"520px"} px={3} w={"min-content"}>
            {rooms ? rooms.map((room) => {
                return <Box key={room.id}>
                    <Button w={40} bg={currRoom === room.id ? '#333' : 'teal'} color={'#fff'}
                        onClick={
                            currRoom !== room.id ?
                            () => {setRoom(room.id)}
                            :
                            ()=>{}
                        }>
                        {room.title}
                    </Button>
                    </Box>
            }) : null }
            </Stack>
        </Box>
    )
}
