import { useState } from 'react'
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


export default function index() {
    const [users, setUsers] = useLocalStorage('users', [])

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
                spacing="4"
                mt="4"
            >
                {users.map(user => (
                    <Flex
                        key={user.username}
                        w="200px"
                        h="50px"
                        gap="4"
                        color="white"
                        alignContent="center"
                    >
                        <Image 
                            src={user.pfp}
                            alt={`${user.username}'s profile picture`}
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
