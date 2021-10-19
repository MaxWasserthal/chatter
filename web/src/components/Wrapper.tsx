import { Box } from '@chakra-ui/layout'
import React from 'react'

export const Wrapper: React.FC<{}> = ({children}) => {
    return (
        <Box mx='auto'>
            {children}
        </Box>
    )
}