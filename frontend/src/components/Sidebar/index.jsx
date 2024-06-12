import { useState, useEffect } from 'react'
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
import axios from 'axios'
import UserCard from '../UserCard'


export default function index({ selectedUser, setSelectedUser, setSelectedUserInfo }) {
    const [users, setUsers] = useLocalStorage('users', [])

    useEffect(() => {
        setSelectedUserInfo(null)
        if (selectedUser && selectedUser.username) {
            axios.get(`${import.meta.env.VITE_API_URL}/user`, {
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
                    <UserCard 
                        user={user}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                    />
                ))}
            </VStack>
        </Box>
    )
}
