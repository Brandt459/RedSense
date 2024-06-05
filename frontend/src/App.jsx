import {
    Box
} from "@chakra-ui/react"
import Sidebar from './components/Sidebar'


function App() {
    return (
        <Box
            bg="darkerBlue"
            w="100vw"
            h="100vh"
        >
            <Sidebar />
        </Box>
    )
}

export default App
