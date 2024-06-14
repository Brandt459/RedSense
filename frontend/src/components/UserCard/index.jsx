import React, { useState } from 'react'
import {
    Flex,
    Text,
    Image
} from "@chakra-ui/react"


export default function index({ user, selectedUser, setSelectedUser }) {
    const [imgSrc, setImgSrc] = useState(user?.pfp ?? "pfp.png")

    return (
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
            backgroundColor={(selectedUser && selectedUser.username === user.username) ? "rgba(255, 69, 0, 1)" : "rgba(255, 69, 0, 0)"}
            _hover={{
                backgroundColor: (selectedUser && selectedUser.username === user.username) ? "rgba(255, 69, 0, 1)" : "rgba(255, 69, 0, 0.5)"
            }}
            transitionProperty="background-color"
            transitionDuration="0.3s"
            transitionTimingFunction="ease-in-out"
            onClick={() => setSelectedUser(user)}
        >
            <Image 
                src={imgSrc}
                alt={`${user.username}'s profile picture`}
                w="10"
                h="10"
                borderRadius="full"
                onError={() => setImgSrc("pfp.png")}
            />
            <Text
                isTruncated
                title={`@${user.username}`}
            >
                @{user.username}
            </Text>
        </Flex>
    )
}
