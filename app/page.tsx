"use client"

import { Box, Button, ChakraProvider, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CreateProduct from "./component/CreateProduct";
import AllProducts from "./component/AllProducts";
import CreateCategory from "./component/CreateCategory";
import CreateSubCategory from "./component/CreateSubCategory";

export default function Home() {
  const [modal,setModal ] = useState("")

  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = React.useState(<OverlayOne />)
  const [openModal,setOpenModal ] = useState(false)

  return (
    <ChakraProvider>
    <main className="flex min-h-screen flex-col justify-between pt-24 pb-24">
      <Box className="flex flex-row justify-between w-full gap-1 p-5">
      <Button
        colorScheme="blue"
        onClick={()=>{setModal("category")
        setOpenModal(!openModal)}
      }
      >
        <Text className="text-white">
        create Category
        </Text>
      </Button>
      <Button
        colorScheme="blue"
        onClick={()=>{setModal("subcategory")
        setOpenModal(!openModal)}
      }
      >
        create sub category
      </Button>
      <Button
        onClick={() => {
          setModal("product")
          setOpenModal(!openModal)
        }}
        colorScheme="blue"
      >
        create Product
      </Button>
        </Box>
       {modal === "product" ?   <CreateProduct modal={openModal} />: modal === "subcategory" ? 
       <CreateSubCategory modal={openModal} />: modal === "category" ? <CreateCategory modal={openModal} />:null}
       <Box>
      <AllProducts/>
       </Box>
    </main>
    </ChakraProvider>
  );
}
