import React from 'react';
import { NavBar } from './NavBar';
import { Wrapper } from './Wrapper';

// returns a wrapping component to always display the navbar
export const Layout: React.FC<{}> = ({children}) => {
    return (
        <>
            <NavBar/>
            <Wrapper>
                {children}
            </Wrapper>
        </>
    )
}