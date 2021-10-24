import React from 'react';
import NextLink from 'next/link';
import { Box, Flex, Heading, Link } from '@chakra-ui/layout';
import { Button, IconButton } from '@chakra-ui/button';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useColorMode } from '@chakra-ui/color-mode';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useIsAuth } from '../utils/useIsAuth';

export const NavBar: React.FC<{}> = () => {

    let content = null
    const router = useRouter();

    const { colorMode, toggleColorMode } = useColorMode()
    const me = useIsAuth()

    const logout = async () => {
        axios.get('http://localhost:3001/logout', {
              withCredentials: true,
        }).then(() => {
            router.reload()
        })
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
                <Box m={3}>
                    <NextLink href="/user">
                        <Button variant="link" color={'#fff'}>{me.username}</Button>
                    </NextLink>
                </Box>
                <Button onClick={async () => {
                    await logout();
                }}
                variant="link" color={'#fff'}>Logout</Button>
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
            <Flex zIndex={1} position="sticky" top={0} bg="teal" p={4} w='100%'>
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
        </>
    )
}
