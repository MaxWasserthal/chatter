import { Box, Flex, Heading, Text } from '@chakra-ui/layout'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import axios from 'axios'
import React from 'react'
import { useQuery } from 'react-query'
import { FormWrapper } from '../components/FormWrapper'
import { NavBar } from '../components/NavBar'
import { useIsAuth } from '../utils/useIsAuth'
import { Tabs, TabList, Tab, TabPanel, TabPanels, Button } from '@chakra-ui/react'
import { SettingsIcon } from '@chakra-ui/icons'
import { Modal, ModalOverlay } from '@chakra-ui/modal'
import { useDisclosure } from '@chakra-ui/hooks'
import { EditUserInfoModal } from '../components/EditUserInfoModal'

interface Logtime {
    timeStart: Date;
    timeEnd: Date;
    id: number;
}

// page to edit user information
const User:React.FC<{}> = () => {

    const me = useIsAuth()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const fetchLogtimes = async () => {
        const {data} = await axios.get<Logtime[]>('http://localhost:3001/logtimes', {
            withCredentials: true,
        })
        return data
    }

    const { data:logtimes } = useQuery('fetchLogtimes', fetchLogtimes)

    return (
        <>
            <NavBar/>
            {me ?
            <FormWrapper>
                {/* create 2 tabs for information and logtimes */}
                <Tabs>
                <TabList>
                    <Tab>Info</Tab>
                    <Tab>Logtimes</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Flex>
                            <Heading as={"h2"} size={"xl"} mb={3} mr={10}>{me!.username}</Heading>
                            <Button aria-label={"Edit userinformation"} rightIcon={<SettingsIcon/>} onClick={onOpen}>Edit</Button>
                            <Modal isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay/>
                                <EditUserInfoModal onClose={onClose} user={me}/>
                            </Modal>
                        </Flex>
                        <Box>
                            {me.email ? 
                                <Text mt={3}>Email: {me.email}</Text>
                            : null }
                            {me.telephone ? 
                                <Text mt={3}>Telephone: {me.telephone}</Text>
                            : null }
                            {me.description ?
                                <Text mt={3}>Description: {me.description}</Text>
                            : null }
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>Start</Th>
                                    <Th>End</Th>
                                    <Th>Total</Th>
                                </Tr>
                            </Thead>
                            {logtimes ?
                            <Tbody>
                                {logtimes.map((lt) => {
                                    return (
                                        <Tr key={lt.id}>
                                            {/* display the logtimes in a formatted way */}
                                            <Td>{new Date(lt.timeStart).toLocaleDateString() + " " + new Date(lt.timeStart).toLocaleTimeString()} </Td>
                                            <Td>{lt.timeEnd ? new Date(lt.timeEnd).toLocaleDateString() + " " + new Date(lt.timeEnd).toLocaleTimeString() : null}</Td>
                                            <Td>{lt.timeEnd ? (Math.abs((new Date(lt.timeEnd).valueOf()) - (new Date(lt.timeStart).valueOf())) / 3600000).toFixed(2) : 0} h</Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                            : null }
                        </Table>
                    </TabPanel>
                    </TabPanels>
                </Tabs>
            </FormWrapper>
            : null }
        </>
    )
}

export default User