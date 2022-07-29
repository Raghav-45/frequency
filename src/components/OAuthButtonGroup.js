import { Button, ButtonGroup, VisuallyHidden } from '@chakra-ui/react'
import { GitHubIcon, GoogleIcon, TwitterIcon } from './ProviderIcons'
import React from 'react'
const providers = [
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

export const OAuthButtonGroup = React.forwardRef((props, ref) => {
  return (
    <ButtonGroup variant="outline" spacing="4" width="full">
      {providers.map(({ name, icon }) => (
        <Button key={name} width="full" {...props}>
          <VisuallyHidden>Sign in with {name}</VisuallyHidden>
          {icon}
        </Button>
      ))}
    </ButtonGroup>
  )
})


// export const OAuthButton = React.forwardRef((props, ref) => {
//   const providers = [
//     {
//       name: 'Google',
//       icon: <GoogleIcon boxSize="5" />,
//     },
//     {
//       name: 'Twitter',
//       icon: <TwitterIcon boxSize="5" />,
//     },
//     {
//       name: 'GitHub',
//       icon: <GitHubIcon boxSize="5" />,
//     },
//   ]
  
//   return (
//     <Button key={props.name} width="full" {...props}>
//       <VisuallyHidden>Sign in with {props.name}</VisuallyHidden>
//       {props.icon}
//     </Button>
//   )
// })