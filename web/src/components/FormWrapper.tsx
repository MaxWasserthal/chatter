import { Box } from '@chakra-ui/layout'
import React from 'react'

// returns a wrapper for forms for uniform styling
export const FormWrapper: React.FC<{}> = ({children}) => {
    return (
        <Box mt={8} mx='auto' maxW={"800px"} w={"100%"}>
            {children}
        </Box>
    )
}