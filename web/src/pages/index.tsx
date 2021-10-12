import { Flex } from '@chakra-ui/layout';
import axios from 'axios';
import React from 'react';
import { useQuery } from 'react-query';
import ChatMessages from '../components/ChatMessages';
import { Layout } from '../components/Layout';
import Sidebar from '../components/Sidebar';

export default function Home() {

    const fetchMe = async () => {
        const {data} = await axios.get('http://localhost:3001/me', {
            withCredentials: true,
        })    
        return data
    }

    const { data:me } = useQuery('fetchMe', fetchMe)

    return (
        <Layout>
            <Flex w={"100%"}>
                {me ? <Sidebar/> : null }
                <ChatMessages />
            </Flex>
        </Layout>
    )
}
