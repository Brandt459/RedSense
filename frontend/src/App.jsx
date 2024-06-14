import { useState, useEffect } from "react"
import {
    Flex
} from "@chakra-ui/react"
import Sidebar from './components/Sidebar'
import UserAnalysis from './components/UserAnalysis'
import axios from "axios"


function App() {
    const [selectedUser, setSelectedUser] = useState()
    const [selectedUserInfo, setSelectedUserInfo] = useState()

    useEffect(() => {
        setSelectedUserInfo(null)
        if (selectedUser && selectedUser.username) {
            axios.get(`${import.meta.env.VITE_API_URL}/analyze_user`, {
                params: {
                    username: selectedUser.username
                }
            })
            .then(res => {
                console.log(res.data)
                setSelectedUserInfo(res.data)
            })
        }
    }, [selectedUser])

    return (
        <Flex
            bg="darkerBlue"
            w="100vw"
            h="100vh"
            overflow="auto"
        >
            <Sidebar 
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
            />
            <UserAnalysis 
                selectedUser={selectedUser}
                selectedUserInfo={selectedUserInfo}
            />
        </Flex>
    )
}

export default App
