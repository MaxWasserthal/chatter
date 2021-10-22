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

interface Member {
    id: number;
    username: string;
}

const CreateRoom:React.FC<{}> = () => {

    useIsAuth()

    const queryClient = useQueryClient()

    const createRoom = async (values:any) => {
        axios.post('http://localhost:3001/rooms', {values}, {
              withCredentials: true,
          })
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
                    await createRoom(values);
                    queryClient.invalidateQueries('fetchRooms')
                    router.push("/")
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