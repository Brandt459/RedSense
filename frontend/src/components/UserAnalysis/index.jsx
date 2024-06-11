import React from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
    Icon,
    VStack
} from "@chakra-ui/react"
import UserCard from '../UserCard'
import { FaUser } from "react-icons/fa6"
import Plot from "react-plotly.js"


export default function index({ selectedUser, setSelectedUser, selectedUserInfo }) {
    return (
        <Box
            h="full"
            w="full"
            p="10"
        >
            {selectedUser &&
                <>
                    <Flex
                        gap="20"
                    >
                        <Box>
                            <Heading
                                fontWeight="extrabold"
                                fontSize="32px"
                                color="white"
                            >
                                Now Analyzing:
                            </Heading>
                            <Box
                                m="4" 
                            >
                                <UserCard 
                                    user={selectedUser}
                                    selectedUser={selectedUser}
                                    setSelectedUser={setSelectedUser}
                                />
                            </Box>
                        </Box>
                        <VStack
                            spacing="5"
                        >
                            <Flex
                                p="4"
                                rounded="xl"
                                bg="darkBlue"
                                borderWidth="1px"
                                borderColor="slateBlue"
                                gap="20"
                            >
                                <Box>
                                    <Text
                                        color="#bec1c6"
                                        fontWeight="semibold"
                                        fontSize="16px"
                                    >
                                        Personality
                                    </Text>
                                    <Text
                                        color="white"
                                        fontWeight="bold"
                                        fontSize="28px"
                                        mt="2"
                                    >
                                        ENTP
                                    </Text>
                                </Box>
                                <Box
                                    bg="purple"
                                    p="4"
                                    borderRadius="25%"
                                    w="14"
                                    h="14"
                                >
                                    <Icon
                                        as={FaUser}
                                        color="white"
                                        boxSize="6"
                                    />
                                </Box>
                            </Flex>
                            <Flex
                                p="4"
                                rounded="xl"
                                bg="darkBlue"
                                borderWidth="1px"
                                borderColor="slateBlue"
                                gap="20"
                            >
                                <Box>
                                    <Text
                                        color="#bec1c6"
                                        fontWeight="semibold"
                                        fontSize="16px"
                                    >
                                        Total Posts
                                    </Text>
                                    <Text
                                        color="white"
                                        fontWeight="bold"
                                        fontSize="28px"
                                        mt="2"
                                    >
                                        {selectedUserInfo?.total_submissions}
                                    </Text>
                                </Box>
                                <Box
                                    bg="purple"
                                    p="4"
                                    borderRadius="25%"
                                    w="14"
                                    h="14"
                                >
                                    <Icon
                                        as={FaUser}
                                        color="white"
                                        boxSize="6"
                                    />
                                </Box>
                            </Flex>
                        </VStack>
                        {selectedUserInfo?.topics_distribution &&
                            <Box>
                                <Plot 
                                    data={[{
                                        values: Object.values(selectedUserInfo.topics_distribution),
                                        labels: Object.keys(selectedUserInfo.topics_distribution),
                                        type: "pie",
                                        textinfo: "label+percent",
                                        insidetextfont: { color: "white" }
                                    }]}
                                    layout={{
                                        width: 400,
                                        height: 400,
                                        color: "#e5e7eb",
                                        paper_bgcolor: 'rgba(0,0,0,0)',
                                        plot_bgcolor: 'rgba(0,0,0,0)',
                                        showlegend: false
                                    }}
                                />
                            </Box>
                        }
                    </Flex>
                </>
            }
        </Box>
    )
}
