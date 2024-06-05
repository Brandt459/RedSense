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
    Input 
} from "@chakra-ui/react"
import { FaPlus } from "react-icons/fa6"
import { FaUserPlus } from "react-icons/fa"


export default function index() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Button
                w="200px"
                h="50px"
                mt="8"
                bg="brightBlue"
                colorScheme="blue"
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
                onClose={onClose}
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
                            Please enter the username of a Twitter / X user
                        </Text>
                        <Box
                            mt="4"
                        >
                            <Text>
                                Username
                            </Text>
                            <Input 
                                placeholder="e.g. elonmusk"
                            />
                        </Box>
                    </ModalBody>
                    <ModalFooter
                        gap="4"
                    >
                        <Button 
                            variant='outline'
                            w="1/2"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button 
                            colorScheme='blue'
                            bg="brightBlue"
                            w="1/2"
                            onClick={onClose}
                        >
                            Confirm
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
