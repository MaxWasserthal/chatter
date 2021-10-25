import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from '@chakra-ui/accordion'
import { Button } from '@chakra-ui/button'
import { useColorMode } from '@chakra-ui/color-mode'
import { AtSignIcon, LockIcon } from '@chakra-ui/icons'
import { Box, Stack } from '@chakra-ui/layout'
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
    dm: boolean;
}

// returns a sidebar that shows all rooms of a user and the direct messages
export default function Sidebar() {

    const {currRoom, setRoom} = useContext(roomContext);
    const { colorMode } = useColorMode()

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
        // make rooms and direct messages closeable
        <Accordion
            position={"absolute"} left={0} width={"15%"}
            height={"88vh"}
            bg={colorMode === 'dark' ? "#1a202c" : "#fff"} border={"none"}
            display={"flex"} flex={1} flexDirection={'column'} flexBasis={'10%'}
            overflowY={"scroll"} overflowX={"hidden"}
            allowMultiple allowToggle defaultIndex={[0]}
            >
            {/* display all normal rooms */}
            <AccordionItem border={"none"}>
                <h2>
                    <AccordionButton color={colorMode === 'dark' ? "#fff" : "#333"}>
                        <Box flex="1" textAlign="left">
                            Rooms
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel p={0}>
                    <Stack spacing={0} w={"100%"}>
                    {rooms ? rooms.filter(r => !r.dm).map((room) => {
                        return <Box key={room.id}>
                            <Button w={"100%"} 
                                bg={currRoom === room.id ? 'teal' : colorMode === 'dark' ? '#1a202c' : '#fff'}
                                color={colorMode === 'dark' ? '#fff' : "#333"} borderRadius={0}
                                pl={3} textAlign={"left"} display={"block"}
                                leftIcon={room.public === true ? <AtSignIcon/> : <LockIcon/>}
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
                </AccordionPanel>
            </AccordionItem>
            
            {/* display all direct message rooms */}
            <AccordionItem border={"none"}>
                <h2>
                    <AccordionButton color={colorMode === 'dark' ? "#fff" : "#333"}>
                        <Box flex="1" textAlign="left">
                            DMs
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel p={0} >
                    <Stack spacing={0} w={"100%"}>
                    {rooms ? rooms.filter(r => r.dm).map((room) => {
                        return <Box key={room.id}>
                            <Button w={"100%"} 
                                bg={currRoom === room.id ? 'teal' : colorMode === 'dark' ? '#1a202c' : '#fff'}
                                color={colorMode === 'dark' ? '#fff' : "#333"} borderRadius={0}
                                pl={3} textAlign={"left"} display={"block"}
                                leftIcon={room.public === true ? <AtSignIcon/> : <LockIcon/>}
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
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}