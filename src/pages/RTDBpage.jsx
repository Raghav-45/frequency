import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../utils/init-firebase'

import { Badge, Flex, Avatar, Box, Text } from '@chakra-ui/react'

import {
  Container,
  Heading,
  Code
} from '@chakra-ui/react'
import { async } from '@firebase/util'

export default function Chatpage() {
  const { currentUser } = useAuth()

  const [Msgg, setMsgg] = useState([])
  const [Loader, setLoader] = useState(true)

  function getData() {
    const q1 = query(collection(db, "ConceptCollection"), where("To", "==", currentUser.uid))
    const q2 = query(collection(db, "ConceptCollection"), where('From', 'in', ['5JiyEv9ZwQfqh3Y6BVH7EtAufaN2', 'jvhBIAQ1CoaAgZsILrQcArbfDjo2']))
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

  useEffect(() => {
    getData()
  }, [])

  function SortArray(a) {
    a.sort(function(a, b){return a.CreatedAt - b.CreatedAt})
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
        <Card maxW='container.lg' mx='auto' mt={40}>
          {Loader === false && SortArray(Msgg).map((elem) => 
            // <Alert status={(elem.From == currentUser.uid) ? 'success' : 'warning'}><AlertIcon />{elem.Message}</Alert>
          <Flex>
            <Avatar size='sm' src={(elem.From == '5JiyEv9ZwQfqh3Y6BVH7EtAufaN2') ? 'https://lh3.googleusercontent.com/a-/AFdZucrdiiwbcviiVAR4JDHCbZYUo0J3F6G2u1gTunMe=s96-c' : 'elem.photoURL'} />
            <Box display='flex' alignItems='center' ml='3'>
              <Code fontWeight='bold'>
              {elem.Message}
              </Code>
            </Box>
          </Flex>
          )}
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
