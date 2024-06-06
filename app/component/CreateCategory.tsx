import { ChevronDownIcon, ChevronRightIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Button, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure,Input, Box, useToast } from '@chakra-ui/react'
import { ObjectId } from 'mongoose'
import React, { useCallback, useEffect, useState } from 'react'

const CreateCategory = (props:any) => {
    const [categoryName,setCategoryName] = useState("")
    const [allCategories,setAllCategories] = useState<[]>()
    const [showAllCategories,setShowAllCategories]= useState(false)
    const [openModal,setOpenModal] = useState(false)
    const [editvalues,setEditValues] = useState({
      categoryName: "",
      _id: ""
    })


    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    useEffect(()=>{
     onOpen()   
    },[props.modal,onOpen])

    const createCategory =  useCallback(async()=>{
        if(categoryName === "")
            {
                return toast({
                    title: 'Category field cannot be empty',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                    position:"top"
                  })
            }
        const res = await fetch("https://nest-e-comm.vercel.app/category/createCategory",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({name:categoryName})
        })
        const data = await res.json()
        setCategoryName("")
        if(data.status){
          if(data.status === 400){
            return toast({
              title: data.message,
              status: 'success',
              duration: 3000,
              isClosable: true,
              position:"top"
            })
          }
        }
    },[categoryName,toast])

    const deleteCategory = useCallback(async(id:any)=>{
        const res = await fetch(`https://nest-e-comm.vercel.app/category/deleteCategory/${id}`,
            {
                method:"Delete",
            },               
        )
        const data = await res.json()
        setCategoryName("hfsjdf")
        if(data.status===200){
          toast({
            title: data.message,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position:"top"
            })
        }
        setCategoryName("")
    },[toast])

    const editCategory = useCallback(async()=>{
      if(editvalues.categoryName === ""){
        return toast({
          title:"kindly fill all the fields",
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position:"top"
        })
      }
        const res = await fetch("https://nest-e-comm.vercel.app/category/editCategory",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(editvalues)
        })
        const data =  await res.json()
        setEditValues({_id:"",categoryName:""})
        setOpenModal(false)
    },[editvalues,setEditValues])

    const getCategories = async()=>{
        const res = await fetch("https://nest-e-comm.vercel.app/category/getAll")
        const data = await res.json()
        setAllCategories(data)
    }

    useEffect(()=>{
        getCategories()
    },[createCategory,deleteCategory,editCategory,categoryName])


  return (
    <div>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Category name</FormLabel>
            <Input type='text' placeholder='enter category name' value={categoryName} onChange={(e)=>setCategoryName(e.target.value.trimEnd())}/>
            </FormControl>
          </ModalBody>
          <Box className='flex flex-row px-9 gap-6 justify-between mb-3 cursor-pointer' onClick={()=>setShowAllCategories(!showAllCategories)}>
          <Text>{showAllCategories ? "Hide":"Show"} all categories</Text>
          {showAllCategories? <ChevronDownIcon boxSize={7}/> :<ChevronRightIcon boxSize={7}/>}
          </Box>
          {showAllCategories ? 
          <Box className='flex flex-col pl-6'>
            {
                allCategories?.map((val:any)=>{
                    return (
                        <Box key={val._id} className='flex-row flex justify-between px-5' >
                    <Text className='border-gray-900 border-b-2 w-52' >{val.name}</Text>
                    <Box className='flex flex-row justify-between w-14 cursor-pointer'>
                        <EditIcon boxSize={5} onClick={()=>{setOpenModal(true),setEditValues({...editvalues,_id:val._id})}}/>
                        <DeleteIcon boxSize={5}  onClick={()=>deleteCategory(val._id)}/>
                    </Box>
                    </Box>
                )
            })
            }
            </Box>
        :""}
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={createCategory}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* New Modal */}
      <Modal isOpen={openModal?true:false} onClose={()=>setOpenModal(false)} >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Category new name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <FormControl>
          <Input type='Text' value={editvalues.categoryName} onChange={(e)=>setEditValues({...editvalues,categoryName:e.target.value})} />
        </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={editCategory}>
              change
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default CreateCategory
