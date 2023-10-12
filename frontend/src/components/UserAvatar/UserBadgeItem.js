import { CloseIcon } from '@chakra-ui/icons'
import { Badge } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <Badge
        px={2}
        py={1}
        borderRadius="xl"
        ml={3}
        mb={2}
        variant="solid"
        fontSize={12}
        colorScheme="purple"
        cursor="pointer"
        onClick={handleFunction}
    >
        {user.name}
        <CloseIcon pl={1} mb={3}></CloseIcon>
    </Badge>
  )
}

export default UserBadgeItem