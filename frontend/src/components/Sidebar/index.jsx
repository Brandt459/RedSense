import {
    Box,
    Flex,
    Heading,
    Center,
    Divider,
    VStack
} from "@chakra-ui/react"
import NewUserButton from './NewUserButton'
import useLocalStorage from 'use-local-storage'
import UserCard from '../UserCard'


export default function index({ selectedUser, setSelectedUser }) {
    const [users, setUsers] = useLocalStorage('users', [])

    return (
        <Box
            bg="darkBlue"
            h="full"
            w="2xs"
            overflow="auto"
        >
            <Flex
                alignContent="center"
                justifyContent="center"
                pt="4"
            >
                <Heading
                    color="primary"
                    fontWeight="extrabold"
                    fontSize="32px"
                >
                    Red
                </Heading>
                <Heading
                    color="white"
                    fontWeight="extrabold"
                    fontSize="32px"
                >
                    Sense
                </Heading>
            </Flex>
            <Center>
                <NewUserButton 
                    users={users}
                    setUsers={setUsers}
                />
            </Center>
            <Box
                px="4"
                mt="4"
            >
                <Divider 
                    orientation="horizontal"
                />
            </Box>
            <VStack
                spacing="2"
                mt="4"
                overflow="auto"
            >
                {users.map(user => (
                    <UserCard 
                        user={user}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        key={user.username}
                    />
                ))}
            </VStack>
        </Box>
    )
}
