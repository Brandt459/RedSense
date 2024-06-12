import React from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
    Icon,
    VStack,
    Spinner,
    Center
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
                        gap="10"
                        h="full"
                    >
                        <Box
                            w="80"
                        >
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
                        {selectedUserInfo ?
                            <>
                                <VStack
                                    spacing="5"
                                >
                                    <Flex
                                        p="4"
                                        rounded="xl"
                                        bg="darkBlue"
                                        borderWidth="1px"
                                        borderColor="slateBlue"
                                        w="64"
                                        h="28"
                                        justifyContent="space-between"
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
                                        w="64"
                                        h="28"
                                        justifyContent="space-between"
                                    >
                                        <Box>
                                            <Text
                                                color="#bec1c6"
                                                fontWeight="semibold"
                                                fontSize="16px"
                                            >
                                                # Posts Analyzed
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
                                    <Box
                                        flexGrow="1"
                                    >
                                        <Flex
                                            p="4"
                                            rounded="xl"
                                            bg="darkBlue"
                                            borderWidth="1px"
                                            borderColor="slateBlue"
                                            gap="10"
                                            maxH="250"
                                        >
                                            <Box>
                                                <Text
                                                    color="#bec1c6"
                                                    fontWeight="semibold"
                                                    fontSize="16px"
                                                >
                                                    Top Topics
                                                </Text>
                                                <Plot 
                                                    data={[{
                                                        values: Object.values(selectedUserInfo.topics_distribution),
                                                        labels: Object.keys(selectedUserInfo.topics_distribution),
                                                        type: "pie",
                                                        textinfo: "label+percent",
                                                        textfont: {
                                                            color: "white"
                                                        }
                                                    }]}
                                                    layout={{
                                                        width: 250,
                                                        height: 180,
                                                        color: "white",
                                                        paper_bgcolor: 'rgba(0,0,0,0)',
                                                        plot_bgcolor: 'rgba(0,0,0,0)',
                                                        margin: {
                                                            l: 50,
                                                            r: 0,
                                                            b: 0,
                                                            t: 50,
                                                            pad: 0
                                                        },
                                                        legend: {
                                                            font: {
                                                                color: 'white'
                                                            }
                                                        }
                                                    }}
                                                    config={{
                                                        displayModeBar: false,
                                                    }}
                                                />
                                            </Box>
                                            <Flex
                                                flexGrow="1"
                                                maxH="full"
                                                flexDir="column"
                                            >
                                                <Text
                                                    color="#bec1c6"
                                                    fontWeight="semibold"
                                                    fontSize="16px"
                                                >
                                                    Sentiment
                                                </Text>
                                                <Flex
                                                    mt="4"
                                                    overflow="auto"
                                                >
                                                    <VStack
                                                        w="50%"
                                                        align="start"
                                                        spacing="1"
                                                    >
                                                        {selectedUserInfo?.average_sentiment_by_topic &&
                                                            Object.keys(selectedUserInfo.average_sentiment_by_topic).map(key => (
                                                                <Text
                                                                    color="white"
                                                                    key={key}
                                                                >
                                                                    {key}
                                                                </Text>
                                                            ))
                                                        }
                                                    </VStack>
                                                    <VStack
                                                        w="50%"
                                                        align="start"
                                                        spacing="1"
                                                    >
                                                        {selectedUserInfo?.average_sentiment_by_topic &&
                                                            Object.entries(selectedUserInfo.average_sentiment_by_topic).map(([key, value]) => (
                                                                <Text
                                                                    color={value === 0 ? "gray" : value > 0 ? "#00ff00" : "#ff0000"}
                                                                    key={key}
                                                                >
                                                                    {value === 0 ? 
                                                                        "Neutral" 
                                                                        :
                                                                        `${Math.abs(value * 100)}% ${value > 0 ? 'Positive' : 'Negative'}`
                                                                    }
                                                                </Text>
                                                            ))
                                                        }
                                                    </VStack>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                }
                            </>
                            :
                            <Center 
                                width="full" 
                                height="full"
                            >
                                <Spinner 
                                    color="brightBlue"
                                    w="250px"
                                    h="250px"
                                    thickness="15px"
                                />
                            </Center>
                        }
                    </Flex>
                </>
            }
        </Box>
    )
}
