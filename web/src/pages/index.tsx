import { Flex } from '@chakra-ui/layout';
import React, { useState } from 'react';
import ChatMessages from '../components/ChatMessages';
import { Layout } from '../components/Layout';
import Sidebar from '../components/Sidebar';
import RoomContext from '../context/room';
import { useIsAuth } from '../utils/useIsAuth';

// builds the indext page
export default function Home() {

    // provide authentication
    const me = useIsAuth()

    // provide current room context
    const [currRoom, setCurrRoom] = useState(1)

    const setRoom = (roomId:number) => {
        setCurrRoom(roomId)
    }

    // returns main page structure
    return (
        <Layout>
            <RoomContext.Provider value={{currRoom, setRoom}}>
                <Flex w={"100%"}>
                    {me ? <Sidebar/> : null }
                    {me ? <ChatMessages/> : null}
                </Flex>
            </RoomContext.Provider>
        </Layout>
    )
}
