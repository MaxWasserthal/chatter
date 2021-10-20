import { ModalContent } from '@chakra-ui/modal'
import axios from 'axios'
import React from 'react'
import { useQueryClient } from 'react-query'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import { useColorMode } from '@chakra-ui/color-mode'

interface Props {
    messageId: number;
}

export const EmojiModalContents: React.FC<Props> = ({messageId}) => {

    const { colorMode } = useColorMode()
    const queryClient = useQueryClient()

    const sendReaction = async (values:any) => {
        await axios.post('http://localhost:3001/reactions', {messageId, ...values}, {
            withCredentials: true,
        })
        .then(async () => {
            await queryClient.invalidateQueries('fetchMessages')
        })
    }

    return (
        <ModalContent style={{ top:'10%', backgroundColor:'transparent', width:'min-content' }}>
            <Picker set={"twitter"} onSelect={sendReaction} theme={colorMode === 'dark' ? 'dark' : 'light'}/>
        </ModalContent>
    )
}