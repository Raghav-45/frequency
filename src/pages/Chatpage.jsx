import React, { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { Card } from '../components/Card'
import { useAuth } from '../contexts/AuthContext'
import { onSnapshot, collection, query, addDoc } from 'firebase/firestore'
import { db } from '../utils/init-firebase'

import {
  Center,
  useBoolean,
  Avatar,
  AvatarBadge,
  Wrap,
  WrapItem,
  chakra,
  Container,
  Heading,
  Divider,
  Text,
  Button,
  FormControl,
  HStack,
  VStack,
  Input,
  FormLabel,
  useToast,
  Box,
  Flex,
  Badge
} from '@chakra-ui/react'

export default function Chatpage() {
  const [MessageTo, setMessageTo] = useState('')
  const [Message, setMessage] = useState('')
  const [MessageTo_Username, setMessageTo_Username] = useState('')

  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { currentUser } = useAuth()

  const date = new Date()

  const [UserDetails, setUserDetails] = useState([])
  const [Loader, setLoader] = useState(true)

  const [ShowDMList, setShowDMList] = useBoolean()

  function getData() {
    // const q = query(collection(db, "ConceptCollection"), where("To", "==", "raghav"), orderBy("CreatedAt"))
    const q = query(collection(db, "UserDetails"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        // cities.push(doc.data().Message);
        cities.push(doc.data());
      })
      setUserDetails(cities)
      setLoader(false)
      // console.log("Data Array: ", Msgg)
    })
  }
  useEffect(() => {
    getData()
  }, [])

  return (
    <Layout>
      <Heading>Chat Page</Heading>
      <Container maxW="container.lg" overflowX="auto" py={4}>
        <Wrap>
          <WrapItem>
            <VStack>
              <Avatar onClick={() => toast({description: "Search Button [Work in Progress]", status: "error", duration: 1000})} src="http://broken-link">
              </Avatar>
              <Text mt='0.25rem !important' noOfLines={1} textAlign="Center" width="100px">Search</Text>
            </VStack>
            {Loader === false && UserDetails.map((elem) => 
              // <WrapItem>
            <VStack>
              <Avatar onClick={() => setMessageTo(elem.uid)} src={elem.PhotoURL}>
                <AvatarBadge boxSize='1.25em' bg='tomato' />
              </Avatar>
              <Text mt='0.25rem !important' noOfLines={1} textAlign="Center" width="100px">{elem.Username}</Text>
            </VStack>
          )}
          </WrapItem>
        </Wrap>
        <Divider orientation='horizontal' mt={2} mb={5} />

        {Loader === false && <Box display={ShowDMList} id='Inbox' borderRadius={17} overflow='hidden'>{
        UserDetails.map((elem) =>
          <Flex p={2} bg='gray.50' _hover={{bg: 'gray.200'}} _active={{bg: 'gray.200'}} onClick={() => {setMessageTo(elem.uid); setMessageTo_Username(elem.Username);}}>
          <Avatar src={elem.PhotoURL}><AvatarBadge boxSize='1.05em' bg='green.400' /></Avatar>
          <Box ml='3'>
            <Text white-space='nowrap' overflow='hidden' text-overflow='ellipsis' fontWeight='bold'>{elem.Username}</Text>
            <Text fontSize='sm'>UI Engineer</Text>
          </Box>
          </Flex>
        )}</Box>}

        <Card maxW="container.lg" mx="auto" mt={40}>
          <FormLabel>{MessageTo_Username}</FormLabel>
          <chakra.form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!Message) {
                toast({
                  description: "Can't Send Empty Message.",
                  status: "error",
                  duration: 1000,
                  // isClosable: true,
                });
                return;
              }

              // your Message Sending logic here
              setIsSubmitting(true);
              await addDoc(collection(db, "ConceptCollection"), {
                From: currentUser.uid,
                To: MessageTo,
                Message: Message,
                // CreatedAt: Timestamp.fromDate(new Date(date.getTime())),
                CreatedAt: date.getTime()
              }).finally(() => {
                setIsSubmitting(false);
              });
            }}
          >
            <HStack spacing="2">
              <FormControl id="Message" size="md" fontSize="md">
                {/* <FormLabel>Email address</FormLabel> */}
                <Input
                  name="Message"
                  placeholder="Message"
                  type="text"
                  // required
                  value={Message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                size="md"
                fontSize="md"
                isLoading={isSubmitting}
              >
                Send
              </Button>
            </HStack>
          </chakra.form>
        </Card>
        {/* <chakra.pre p={4}>
          {currentUser && <pre> {JSON.stringify(currentUser, null, 2)}</pre>}
        </chakra.pre> */}
      </Container>
    </Layout>
  );
}
