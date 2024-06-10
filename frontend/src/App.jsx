import { useState } from "react"
import {
    Flex
} from "@chakra-ui/react"
import Sidebar from './components/Sidebar'
import UserAnalysis from './components/UserAnalysis'


function App() {
    const [selectedUser, setSelectedUser] = useState()
    const [selectedUserInfo, setSelectedUserInfo] = useState()

    return (
        <Flex
            bg="darkerBlue"
            w="100vw"
            h="100vh"
        >
            <Sidebar 
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                setSelectedUserInfo={setSelectedUserInfo}
            />
            <UserAnalysis 
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                selectedUserInfo={selectedUserInfo}
            />
        </Flex>
    )
}

export default App
