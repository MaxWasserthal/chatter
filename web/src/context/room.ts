import { createContext } from 'react';

// create a context for the current room to provide to all components
const RoomContext = createContext({
    currRoom: 1,
    setRoom: (room:number) => {}
})

export default RoomContext;