import { useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    Center,
    Divider
} from "@chakra-ui/react"
import NewUserButton from './NewUserButton'


export default function index() {
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
                <NewUserButton />
            </Center>
            <Box
                px="4"
                mt="4"
            >
                <Divider 
                    orientation="horizontal"
                />
            </Box>
        </Box>
    )
}
