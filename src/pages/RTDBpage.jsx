import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { doc, addDoc, getDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../utils/init-firebase'

import { Badge, Flex, Avatar, Box, Text } from '@chakra-ui/react'

import {
  Container,
  Heading,
  Code,
  VStack,
  Wrap,
  WrapItem,
  AvatarBadge,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  toast,
  chakra
} from '@chakra-ui/react'
import { async } from '@firebase/util'

export default function Chatpage() {
  const { currentUser } = useAuth()

  const [Msgg, setMsgg] = useState([])
  const [UserDetails, setUserDetails] = useState([])
  const [Loader, setLoader] = useState(true)
  // const [GetUserDetailsOf_uid, setGetUserDetailsOf_uid] = useState('')
  const date = new Date()
  const [MessageTo, setMessageTo] = useState('')
  const [MessageTo_Username, setMessageTo_Username] = useState('')
  const [Message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)


  function getChatsOfCurrentUserWith(uid) {
    const q1 = query(collection(db, "ConceptCollection"), where("To", "==", currentUser.uid))
    const q2 = query(collection(db, "ConceptCollection"), where('From', 'in', [uid, currentUser.uid]))
    const unsubscribe = onSnapshot(q2, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        cities.push(doc.data());
      })
      setMsgg(cities)
      // console.log(cities)
      setLoader(false)
    })
  }

  // useEffect(() => {
  //   getData()
  // }, [])

  function getUserData() {
    // const q = query(collection(db, "ConceptCollection"), where("To", "==", "raghav"), orderBy("CreatedAt"))
    const q = query(collection(db, "UserDetails"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        // cities.push(doc.data().Message);
        cities.push(doc.data());
      })
      setUserDetails(cities)
      console.log(cities)
      setLoader(false)
      // console.log("Data Array: ", Msgg)
    })
  }
  useEffect(() => {
    getUserData()
  }, [])

  function SortArray(a) {
    a.sort(function(a, b){return a.CreatedAt - b.CreatedAt})
    console.log(a)
    return a
  }

  function Dd(a1, a2) {
    Array.prototype.diff = function(a) {
      return this.filter(function(i) {return a.indexOf(i) < 0;})
    };
    const diff1 = a1.diff( a2 )
    console.log("Difference Between Given Arrays: ", diff1)
  }

  return (
    <Layout>
      <Heading>RealTime DataBase Update Page</Heading>
      <Container maxW='container.lg' overflowX='auto' py={4}>
        <Wrap>
          <WrapItem>
            {Loader === false && UserDetails.map((elem) => 
              <VStack>
                <Avatar onClick={() => {getChatsOfCurrentUserWith(elem.uid); setMessageTo_Username(elem.Username); setMessageTo(elem.uid)}} src={elem.PhotoURL}>
                  <AvatarBadge boxSize='1.25em' bg='tomato' />
                </Avatar>
                <Text mt='0.25rem !important' noOfLines={1} textAlign="Center" width="100px">{elem.Username}</Text>
              </VStack>
            )}
          </WrapItem>
        </Wrap>
        <Card maxW='container.lg' mx='auto' mt={40}>
        {Loader === false && SortArray(Msgg).map((elem) => 
          <Flex ml='3' mr='3' py={0.5}>
            <Box mr={(elem.To == currentUser.uid) ? 'auto' : '3'} ml={(elem.To == currentUser.uid) ? '3' : 'auto'} display='flex' alignItems='center'>
              {(elem.To == currentUser.uid) 
                ? <Avatar size='sm' src={UserDetails[UserDetails.findIndex(e => e.uid == elem.From)].PhotoURL} />
                : ''
              }
              <Code fontWeight='bold'>
                {elem.Message}
              </Code>
              {(elem.To == currentUser.uid) 
                ? ''
                : <Avatar size='sm' src={UserDetails[UserDetails.findIndex(e => e.uid == elem.From)].PhotoURL} />
              }
            </Box>
          </Flex>
        )}
        </Card>

        <Card maxW="container.lg" mx="auto" mt={40}>
          {/* <FormLabel>{UserDetails[UserDetails.findIndex(e => e.uid == MessageTo)].Username}</FormLabel> */}
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

        {/* <Card maxW='container.lg' mx='auto' mt={40}>
          <Flex>
            <Avatar size='sm' src={elem.photoURL} />
            <Box display='flex' alignItems='center' ml='3'>
              <Code fontWeight='bold'>
                Segun Adebayo
              </Code>
            </Box>
          </Flex>
        </Card> */}
        
        {/* <Flex>
          <Avatar src='https://bit.ly/sage-adebayo' />
          <Box ml='3'>
            <Text fontWeight='bold'>
              Segun Adebayo
              <Badge ml='1' colorScheme='green'>
                New
              </Badge>
            </Text>
            <Text fontSize='sm'>UI Engineer</Text>
          </Box>
        </Flex> */}
      </Container>
    </Layout>
  )
}
