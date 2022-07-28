import React, { useState } from 'react'
import {
  chakra,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  useToast,
  Text,
  useBreakpointValue,
  useColorModeValue,
  ButtonGroup,
} from '@chakra-ui/react'
import { VisuallyHidden } from '@chakra-ui/react'
import { GitHubIcon, GoogleIcon, TwitterIcon } from '../components/ProviderIcons'
import { Layout } from '../components/Layout'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import useMounted from '../hooks/useMounted'
// import { OAuthButton } from '../components/OAuthButtonGroup'
import { PasswordField } from '../components/PasswordField'

export default function Loginpage() {
  const { signInWithGoogle, login } = useAuth()
  const history = useHistory()
  const location = useLocation()
  const mounted = useMounted()
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const iconProviders = [
    {
      name: 'Google',
      icon: <GoogleIcon boxSize="5" />,
    },
    {
      name: 'Twitter',
      icon: <TwitterIcon boxSize="5" />,
    },
    {
      name: 'GitHub',
      icon: <GitHubIcon boxSize="5" />,
    },
  ]

  function handleRedirectToOrBack() {
    history.replace(location.state?.from ?? '/profile')
  }
  
  return (
    <Layout>
      <Container maxW="lg" py={{base: '12', md: '24'}} px={{base: '0', sm: '8'}}>
        <Stack spacing="8">
          <Stack spacing="6">
            {/* <Logo /> */}
            <Stack
              spacing={{
                base: '2',
                md: '3',
              }}
              textAlign="center"
            >
              <Heading
                size={useBreakpointValue({
                  base: 'xs',
                  md: 'sm',
                })}
              >
                Log in to your account
              </Heading>
              <HStack spacing="1" justify="center">
                <Text color="muted">Don't have an account?</Text>
                <Button variant="link" colorScheme="blue" onClick={() => history.push('/register')}>
                  Sign up
                </Button>
              </HStack>
            </Stack>
          </Stack>
          <Box
            py={{
              base: '0',
              sm: '8',
            }}
            px={{
              base: '4',
              sm: '10',
            }}
            bg={useBreakpointValue({
              base: 'transparent',
              sm: 'bg-surface',
            })}
            boxShadow={{
              base: 'none',
              sm: useColorModeValue('md', 'md-dark'),
            }}
            borderRadius={{
              base: 'none',
              sm: 'xl',
            }}
          >
            <chakra.form
              onSubmit={async e => {
                e.preventDefault()
                if (!email || !password) {
                  toast({
                    description: 'Credentials not valid.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                  })
                  return
                }
                // your login logic here
                setIsSubmitting(true)
                login(email, password)
                  .then(res => {
                    handleRedirectToOrBack()
                  })
                  .catch(error => {
                    console.log(error.message)
                    toast({
                      description: error.message,
                      status: 'error',
                      duration: 9000,
                      isClosable: true,
                    })
                  })
                  .finally(() => {
                    // setTimeout(() => {
                    //   mounted.current && setIsSubmitting(false)
                    //   console.log(mounted.current)
                    // }, 1000)
                    mounted.current && setIsSubmitting(false)
                  })
              }}
              >
              <Stack spacing="6">
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      type='email'
                      autoComplete='email'
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </FormControl>
                  <PasswordField
                    name='password'
                    autoComplete='password'
                    value={password}
                    required
                    onChange={e => setPassword(e.target.value)}
                  />
                </Stack>
                <HStack justify="space-between">
                  <Checkbox defaultChecked>Remember me</Checkbox>
                  <Button variant="link" colorScheme="blue" size="sm">
                    Forgot password?
                  </Button>
                </HStack>
                <Stack spacing="6">
                  <Button
                    type='submit'
                    colorScheme='blue'
                    size='lg'
                    fontSize='md'
                    isLoading={isSubmitting}
                  >
                    Sign in
                  </Button>
                  <HStack>
                    <Divider />
                    <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                      or continue with
                    </Text>
                    <Divider />
                  </HStack>
                  <ButtonGroup variant="outline" spacing="4" width="full">
                  <Button key='Google' width="full"
                    onClick={() =>
                      signInWithGoogle()
                        .then(user => {
                          handleRedirectToOrBack()
                          console.log(user)
                        })
                        .catch(e => console.log(e.message))
                    }
                  >
                    <VisuallyHidden>Sign in with 'Google'</VisuallyHidden>
                    {iconProviders[0].icon}
                  </Button>
                  <Button key='Twitter' width="full"

                  >
                    <VisuallyHidden>Sign in with 'Twitter'</VisuallyHidden>
                    {iconProviders[1].icon}
                  </Button>
                  <Button key='Github' width="full"

                  >
                    <VisuallyHidden>Sign in with 'Github'</VisuallyHidden>
                    {iconProviders[2].icon}
                  </Button>
                  </ButtonGroup>
                </Stack>
              </Stack>
            </chakra.form>
          </Box>
        </Stack>
      </Container>
    </Layout>
  )
}
