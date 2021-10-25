import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import axios from 'axios';
import { Formik, Form } from 'formik';
import router from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import CustomSelect from '../components/CustomSelect';
import { CustomCheckbox } from '../components/CustomCheckbox';
import { useQuery, useQueryClient } from 'react-query';
import { useIsAuth } from '../utils/useIsAuth';
import { FormWrapper } from '../components/FormWrapper';
import { useToast } from '@chakra-ui/toast';

interface Member {
    id: number;
    username: string;
}

// extra page for creating a new room
const CreateRoom:React.FC<{}> = () => {

    // check if user is authenticated
    useIsAuth()

    const queryClient = useQueryClient()

    const toast = useToast()

    // method for creating a new room
    const createRoom = async (values:any) => {
        const res = axios.post('http://localhost:3001/rooms', {values}, {
              withCredentials: true,
        })

        .catch((err) => {
            toast({
                title: err.response.data.message,
                status: 'error',
                isClosable: true,
            });
            return null
        })
        return res
    }

    const fetchMembers = async () => {
        const {data} = await axios.get<Member[]>('http://localhost:3001/members', {
            withCredentials: true,
        })
        return data
    }

    const { data:members } = useQuery('fetchMembers', fetchMembers)

    return (
        <FormWrapper>
            <Formik
                initialValues={{title: '', publ: true, members: [] as Member[], dm: false}}
                onSubmit={async (values) => {
                    if(values.title !== '' && values.members?.length !== 0) {
                        const res = await createRoom(values);
                        if(res) {
                            await queryClient.invalidateQueries('fetchRooms')
                            router.push("/")
                        }
                    }
                    else if(values.title === '') {
                        toast({
                            title: "Enter a title",
                            status: 'error',
                            isClosable: true,
                        });
                    }
                    else {
                        toast({
                            title: "Select members",
                            status: 'error',
                            isClosable: true,
                        });
                    }
                }}
                >
                {({isSubmitting}) => (
                <Form>
                    <InputField name="title" placeholder="title" label="Title" />
                    <Box mt={4}>
                        <CustomCheckbox name="publ" label="Public">Public</CustomCheckbox>
                    </Box>
                    {members ?
                    <Box mt={4}>
                        <CustomSelect name="members" label="Members">
                            {members.map((member) => (
                            <option key={member.username} value={member.id}>
                                {member.username}
                            </option>
                            ))}
                        </CustomSelect>
                    </Box>
                    : null }
                    <Button type="submit" colorScheme="teal" mt={5} isLoading={isSubmitting}>Create Room</Button>
                </Form>
                )}
            </Formik>
        </FormWrapper>
    )
}

export default CreateRoom;