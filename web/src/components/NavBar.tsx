import React, { useState } from 'react';
import NextLink from 'next/link';
import { Box, Flex, Heading, Link } from '@chakra-ui/layout';
import { Button, IconButton } from '@chakra-ui/button';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import axios from 'axios';
import { useColorMode } from '@chakra-ui/color-mode';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export const NavBar: React.FC<{}> = () => {

    let content = null
    const router = useRouter();
    const logout = async () => {
        axios.get('http://localhost:3001/logout', {
              withCredentials: true,
        }).then(() => {
            router.reload()
        })
    }

    const [me, setMe] = useState();
    const { colorMode, toggleColorMode } = useColorMode()

    const getUsername = () => {
        axios.get('http://localhost:3001/me', {
            withCredentials: true,
        })
        .then((response) => {
            setMe(response.data);
          });
    }

    if(!me) {
        getUsername();
    }

    if(me) {
        content = (
            <Flex align="center">
                <IconButton
                    aria-label="Dark"
                    icon={colorMode==="light" ? <SunIcon/> : <MoonIcon/>}
                    onClick={toggleColorMode}
                    mr={10}/>
                <NextLink href="/create-room">
                    <Button as={Link} mr={2} alignSelf="center">create room</Button>
                </NextLink>
                <Box m={3}>{me}</Box>
                <Button onClick={async () => {
                    await logout();
                }}
                variant="link">Logout</Button>
            </Flex>
        )
    } else {
        content = (
            <>
                <IconButton
                    aria-label="Dark"
                    icon={colorMode==="light" ? <SunIcon/> : <MoonIcon/>}
                    onClick={toggleColorMode}
                    mr={5}/>
                <NextLink href="/login">
                    <Button mr={2}>Login</Button>
                </NextLink>
                <NextLink href="/register">
                    <Button>Register</Button>
                </NextLink>
            </>
        )
    }

    return (
        <>
            <Flex zIndex={1} position="sticky" top={0} bg="teal" p={4} >
                <Flex m="auto" flex={1} align="center" maxW={800}>
                    <NextLink href="/">
                        <Link>
                            <Heading>Chatter</Heading>
                        </Link>
                    </NextLink>
                    <Box ml={'auto'}>
                        {content}
                    </Box>
                </Flex>
            </Flex>
            {me ? <Sidebar/> : null }
        </>
    )
}
