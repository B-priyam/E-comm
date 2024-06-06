import { Modal, ModalBody, ModalContent, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect } from 'react'

const Loading = () => {
        const { isOpen, onOpen, onClose } = useDisclosure()
      useEffect(()=>{
      onOpen()
      },[])
        return (
          <>
            <Modal
              isCentered
              isOpen={isOpen}
              onClose={onClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalBody pb={20} pt={20}>
                 <Text className='text-center'>uploading image...</Text>
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )
      
}

export default Loading
