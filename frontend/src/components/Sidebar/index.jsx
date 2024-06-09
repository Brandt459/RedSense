import { useState, useEffect } from 'react'
import {
    Box,
    Flex,
    Heading,
    Center,
    Divider,
    VStack,
    Text,
    Image
} from "@chakra-ui/react"
import NewUserButton from './NewUserButton'
import useLocalStorage from 'use-local-storage'
import axios from 'axios'


export default function index() {
    const [users, setUsers] = useLocalStorage('users', [])
    const [selectedUser, setSelectedUser] = useState()

    useEffect(() => {
        if (selectedUser && selectedUser.username) {
            axios.get(`${import.meta.env.VITE_API_URL}/analyze_user`, {
                params: {
                    username: selectedUser.username
                }
            })
            .then(res => console.log(res.data))
        }
    }, [selectedUser])

    return (
        <Box
            bg="darkBlue"
            h="full"
            w="2xs"
        >
            <Flex
                alignContent="center"
                justifyContent="center"
                pt="4"
            >
                <Heading
                    color="brightBlue"
                    fontWeight="extrabold"
                    fontSize="32px"
                >
                    Twit
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
            >
                {users.map(user => (
                    <Flex
                        key={user.username}
                        w="200px"
                        h="50px"
                        gap="4"
                        p="4"
                        rounded="md"
                        color="white"
                        alignItems="center"
                        cursor="pointer"
                        backgroundColor={(selectedUser && selectedUser.username === user.username) ? "rgba(72, 128, 255, 1)" : "rgba(72, 128, 255, 0)"}
                        _hover={{
                            backgroundColor: (selectedUser && selectedUser.username === user.username) ? "rgba(72, 128, 255, 1)" : "rgba(72, 128, 255, 0.5)"
                        }}
                        transitionProperty="background-color"
                        transitionDuration="0.3s"
                        transitionTimingFunction="ease-in-out"
                        onClick={() => setSelectedUser(user)}
                    >
                        <Image 
                            src={user.pfp}
                            alt={`${user.username}'s profile picture`}
                            w="10"
                            h="10"
                        />
                        <Text>
                            @{user.username}
                        </Text>
                    </Flex>
                ))}
            </VStack>
        </Box>
    )
}
