import React from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
    Icon,
    VStack,
    Spinner,
    Center,
    Divider,
    Button
} from "@chakra-ui/react"
import UserCard from '../UserCard'
import { FaUser } from "react-icons/fa6"
import Plot from "react-plotly.js"
import { BsEmojiLaughingFill, BsEmojiSmileFill, BsEmojiNeutralFill, BsEmojiFrownFill, BsEmojiAngryFill } from "react-icons/bs"
import QAChat from "./QAChat"
import axios from 'axios'


export default function index({ selectedUser, selectedUserInfo, setSelectedUserInfo }) {
    const rerunAnalysis = () => {
        if (selectedUser) {
            setSelectedUserInfo(null)

            axios.get(`${import.meta.env.VITE_API_URL}/analyze_user`, {
                params: {
                    username: selectedUser.username
                }
            })
            .then(res => {
                console.log(res.data)
                setSelectedUserInfo(res.data)
            })
            .catch(error => {
                console.log(error)
                setSelectedUserInfo(null)
            })
        }
    }

    return (
        <Flex
            flexDir="column"
            h="full"
            w="full"
            overflow="auto"
            p="10"
        >
            {selectedUser &&
                <>
                    <Flex
                        gap="10"
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
                                    setSelectedUser={() => {}}
                                />
                            </Box>
                            {selectedUserInfo &&
                                <Button
                                    m="4"
                                    w="200px"
                                    h="50px"
                                    bg="none"
                                    color="white"
                                    borderColor="slateBlue"
                                    borderWidth="2px"
                                    colorScheme='whiteAlpha'
                                    onClick={rerunAnalysis}
                                >
                                    Rerun Analysis
                                </Button>
                            }
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
                                                Overall Attitude
                                            </Text>
                                            {![null, undefined].includes(selectedUserInfo?.overall_average_sentiment) &&
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="28px"
                                                    mt="2"
                                                    color={
                                                        selectedUserInfo.overall_average_sentiment === 0 ? "gray" : 
                                                        selectedUserInfo.overall_average_sentiment > 0 ? "#00ff00" : "#ff0000"
                                                    }
                                                >
                                                    {selectedUserInfo.overall_average_sentiment === 0 ? 
                                                        "Neutral" 
                                                        :
                                                        `${selectedUserInfo.overall_average_sentiment > 0 ? '+' : '-'}${parseFloat(Math.abs(selectedUserInfo.overall_average_sentiment * 100).toFixed(2))}%`
                                                    }
                                                </Text>
                                            }
                                        </Box>
                                        <Box
                                            p="2"
                                        >
                                            <Icon
                                                as={
                                                    [null, undefined].includes(selectedUserInfo?.overall_average_sentiment) ? BsEmojiNeutralFill :
                                                    selectedUserInfo.overall_average_sentiment >= 0.5 ? BsEmojiLaughingFill :
                                                    selectedUserInfo.overall_average_sentiment > 0 ? BsEmojiSmileFill :
                                                    selectedUserInfo.overall_average_sentiment === 0 ? BsEmojiNeutralFill :
                                                    selectedUserInfo.overall_average_sentiment > -0.5 ? BsEmojiFrownFill : BsEmojiAngryFill
                                                }
                                                color={
                                                    [null, undefined].includes(selectedUserInfo?.overall_average_sentiment) ? "gray" :
                                                    selectedUserInfo.overall_average_sentiment === 0 ? "gray" : 
                                                    selectedUserInfo.overall_average_sentiment > 0 ? "#00ff00" : "#ff0000"
                                                }
                                                boxSize="10"
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
                                                        hoverinfo: "label+percent",
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
                                                            r: 50,
                                                            b: 50,
                                                            t: 50,
                                                            pad: 0
                                                        },
                                                        showlegend: false
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
                                                <VStack
                                                    spacing="1"
                                                    mt="4"
                                                    overflow="auto"
                                                >
                                                    {![null, undefined].includes(selectedUserInfo?.average_sentiment_by_topic) &&
                                                        Object.entries(selectedUserInfo.average_sentiment_by_topic).map(([key, value]) => (
                                                            <Flex
                                                                w="full"
                                                                gap="4"
                                                            >
                                                                <Box
                                                                    w="50%"
                                                                >
                                                                    <Text
                                                                        color="white"
                                                                        key={key}
                                                                    >
                                                                        {key}
                                                                    </Text>
                                                                </Box>
                                                                <Box
                                                                    w="50%"
                                                                >
                                                                    <Text
                                                                        color={value === 0 ? "gray" : value > 0 ? "#00ff00" : "#ff0000"}
                                                                        key={key}
                                                                    >
                                                                        {value === 0 ? 
                                                                            "Neutral" 
                                                                            :
                                                                            `${value > 0 ? '+' : '-'}${parseFloat(Math.abs(value * 100).toFixed(2))}%`
                                                                        }
                                                                    </Text>
                                                                </Box>
                                                            </Flex>
                                                        ))
                                                    }
                                                </VStack>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                }
                            </>
                            :
                            <Center 
                                width="full" 
                                height="full"
                                display="flex"
                                flexDir="column"
                            >
                                <Spinner 
                                    color="primary"
                                    w="250px"
                                    h="250px"
                                    thickness="15px"
                                />
                                <Text
                                    color="white"
                                    fontSize="32px"
                                    mt="4"
                                >
                                    Analyzing user, this may take 2-3 minutes
                                </Text>
                            </Center>
                        }
                    </Flex>
                    {selectedUserInfo && selectedUserInfo.qa_model_available &&
                        <>
                            <Box
                                mt="6"
                            >
                                <Divider 
                                    orientation="horizontal"
                                />
                            </Box>
                            <QAChat 
                                selectedUser={selectedUser}
                            />
                        </>
                    }
                </>
            }
        </Flex>
    )
}
