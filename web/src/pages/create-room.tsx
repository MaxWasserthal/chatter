import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import axios from 'axios';
import { Formik, Form } from 'formik';
import router from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useState, useEffect } from 'react';
import CustomSelect from '../components/CustomSelect';
import { CustomCheckbox } from '../components/CustomCheckbox';

interface Member {
    id: number;
    username: string;
}

const CreateRoom:React.FC<{}> = () => {

    const [me, setMe] = useState();
    const [members, setMembers] = useState<Member[]>([]);

    const getUsername = () => {
        axios.get('http://localhost:3001/me', {
            withCredentials: true,
        })
        .then((response) => {
            setMe(response.data);
          });
    }

    const createRoom = async (values:any) => {
        axios.post('http://localhost:3001/create-room', {values}, {
              withCredentials: true,
          })
          .then(() => {
            router.replace("/")
          })
          .catch((err:any) => {
            console.log(err);
          });
    }

    const getMembers = async () => {
        axios.get<Member[]>('http://localhost:3001/members', {
            withCredentials: true,
        })
        .then((response) => {
            setMembers(response.data);
        })
    }

    useEffect(() => {}, [members])

    if(!me) {
        getUsername();
    }

    if(members.length === 0 && me) {
        getMembers();
    }

    return (
        <Wrapper>
            <Formik
                initialValues={{title: '', publ: true, members: [] as Member[]}}
                onSubmit={async (values) => {
                    console.log(values)
                    await createRoom(values);
                    router.push("/")
                }}
                >
                {({isSubmitting}) => (
                    <Form>
                    <InputField name="title" placeholder="title" label="Title" />
                    <Box mt={4}>
                        <CustomCheckbox name="publ" label="Public">Public</CustomCheckbox>
                    </Box>
                    {members.length > 0 ?
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
        </Wrapper>
    )
}

export default CreateRoom;