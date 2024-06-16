import { useState } from 'react'
import {
    Text,
    Button,
    Icon,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Box,
    Heading,
    Input,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Flex
} from "@chakra-ui/react"
import { FaPlus } from "react-icons/fa6"
import { FaUserPlus } from "react-icons/fa"
import axios from 'axios'


export default function index({ users, setUsers }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')

    const handleClose = () => {
        onClose()
        setUsername('')
        setError('')
    }

    const getUserInfo = (e) => {
        e.preventDefault()

        if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
            setError('Username already in list of users!')
        } else {
            axios.get(`${import.meta.env.VITE_API_URL}/profile-photo`, {
                params: {
                    username: username
                }
            })
            .then(res => {
                const user = {
                    username: username,
                    pfp: res.data.profile_photo_url ?? "pfp.png"
                }
    
                setUsers(prev => [ ...prev, user ])
                handleClose()
            })
            .catch(error => {
                console.log(error)
                if (error?.response?.data?.message) {
                    setError(error.response.data.message)
                }
            })
        }
    }

    return (
        <>
            <Button
                w="200px"
                h="50px"
                mt="8"
                bg="primary"
                colorScheme="orange"
                gap="4"
                onClick={onOpen}
            >
                <Icon
                    as={FaPlus}
                    boxSize="6"
                />
                <Text
                    fontSize="20px"
                >
                    New User
                </Text>
            </Button>
            <Modal 
                isOpen={isOpen} 
                onClose={handleClose}
                isCentered
            >
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>
                        <Box
                            border="1px solid #E4E7EC"
                            p="2"
                            rounded="xl"
                            display="inline-flex"
                        >
                            <Icon 
                                as={FaUserPlus}
                                boxSize="6"
                            />
                        </Box>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Heading
                            fontWeight="bold"
                            fontSize="18px"
                        >
                            New User
                        </Heading>
                        <Text
                            fontSize="14px"
                        >
                            Please enter the username of a Reddit user
                        </Text>
                        <form
                            onSubmit={getUserInfo}
                        >
                            <FormControl 
                                isInvalid={error}
                            >
                                <Box
                                    mt="4"
                                >
                                    <FormLabel 
                                        htmlFor="username-input"
                                    >
                                        Username
                                    </FormLabel>
                                    <Input 
                                        placeholder="e.g. elonmusk"
                                        value={username}
                                        onInput={e => setUsername(e.target.value)}
                                    />
                                    {error && 
                                        <FormErrorMessage>
                                            {error}
                                        </FormErrorMessage>
                                    }
                                </Box>
                            </FormControl>
                            <Flex
                                gap="4"
                                mt="4"
                                justifyContent="end"
                            >
                                <Button 
                                    variant='outline'
                                    w="1/2"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    colorScheme='orange'
                                    bg="primary"
                                    w="1/2"
                                    type="submit"
                                >
                                    Confirm
                                </Button>
                            </Flex>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
