import { createContext } from 'react';

const RoomContext = createContext({
    currRoom: 1,
    setRoom: (room:number) => {}
})

export default RoomContext;