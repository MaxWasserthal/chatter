import { Flex } from '@chakra-ui/layout';
import axios from 'axios';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import ChatMessages from '../components/ChatMessages';
import { Layout } from '../components/Layout';
import Sidebar from '../components/Sidebar';
import RoomContext from '../context/room';

export default function Home() {

    const fetchMe = async () => {
        const {data} = await axios.get('http://localhost:3001/me', {
            withCredentials: true,
        })    
        return data
    }

    const { data:me } = useQuery('fetchMe', fetchMe)

    const [currRoom, setCurrRoom] = useState(1)

    const setRoom = (roomId:number) => {
        setCurrRoom(roomId)
    }

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
