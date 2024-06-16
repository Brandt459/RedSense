import React, { useState, useEffect, useRef } from 'react'
import {
    Box,
    Flex,
    Text,
    VStack
} from '@chakra-ui/react'
import { PulseLoader } from 'react-spinners'
import TextareaAutosize from 'react-textarea-autosize'
import axios from 'axios'


export default function index({ selectedUser }) {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const chatContainerRef = useRef(null)
    const [isLoading, setIsLoading] = useState(false)


    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { content: input, role: 'user' }])
            setInput('')
            setIsLoading(true)
            
            axios.post(`${import.meta.env.VITE_API_URL}/prompt`, {
                question: input,
                username: selectedUser.username,
                messages: messages
            })
            .then(res => {
                setIsLoading(false)
                const modelResponse = { content: res.data, role: 'assistant' }
                setMessages((prevMessages) => [...prevMessages, modelResponse])
            })
            .catch(error => {
                setIsLoading(false)
                const modelResponse = { content: error.message, role: 'assistant' }
                setMessages((prevMessages) => [...prevMessages, modelResponse])
            })
        }
    }


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [messages])


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }


    return (
        <Flex
            direction="column"
            mt="5"
            overflow="auto"
        >
            <VStack 
                align="start" 
                spacing="3"
                overflow="auto"
                ref={chatContainerRef}
                px="4"
            >
                {messages.map((message, index) => (
                    <Box 
                        key={index} 
                        p="2" 
                        bg={message.role === "user" ? "darkBlue" : "primary"}
                        borderRadius="md" 
                        alignSelf={message.role === 'user' ? 'flex-start' : 'flex-end'}
                        wordBreak="break-word"
                        whiteSpace="pre-wrap"
                    >
                        <Text
                            color="white"
                        >
                            {message.content}
                        </Text>
                    </Box>
                ))}
                {isLoading && (
                    <Box 
                        p="2" 
                        bg="primary" 
                        borderRadius="md" 
                        alignSelf="flex-end"
                    >
                        <PulseLoader 
                            size={10} 
                            color="white" 
                        />
                    </Box>
                )}
            </VStack>
            <Flex 
                as="form" 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
                mt="4"
            >
                <Box
                    as={TextareaAutosize}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    resize="none"
                    bg="darkBlue"
                    p="10px"
                    borderRadius="5px"
                    color="white"
                    minH="40px"
                    maxH="200px"
                    overflow="auto"
                    disabled={isLoading}
                    width="100%"
                    _focus={{ 
                        outline: "none"
                    }}
                />
            </Flex>
        </Flex>
    )
}
