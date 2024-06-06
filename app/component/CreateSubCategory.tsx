import { ChevronDownIcon, ChevronRightIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, FormLabel, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'

const CreateSubCategory = (props:any) => {
    const [categories,setCategories] = useState<any[]>()
    const [categoryChoosen,setCategoryChoosen] = useState("Choose Category")
    const [showAllCategories,setShowAllCategories]= useState(false)
    const [subCategory,setSubCategory] = useState<any>(undefined)
    const [newData,setNewData] = useState({
      categoryId:"",
      name:""
    })
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

    const getCategory = async()=>{
      const response = await fetch('http://localhost:3000/category/getAll')
      const data = await response.json()
      setCategories(data)
    }

    const createSubCategory = useCallback(async()=>{
      if(!newData.categoryId){
        return toast({
          title: 'Kindly choose a category first',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position:"top"
        })
      }
      if(!newData.name){
        return toast({
          title: 'category field cannot be empty',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position:"top"
        })
      }

        const res = await fetch("http://localhost:3000/sub-category/createNewSubCategory",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(newData)
        })
        const data = await res.json()
        if(data.status === 400){
          return toast({
            title: data.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position:"top"
          })
        }
        setNewData({...newData,name:""})
        
    },[newData,toast])


    const getsubCategory =  useCallback(async()=>{
      const res = await fetch(`http://localhost:3000/sub-category/getAllSubCategory?id=${newData.categoryId}`)
      const data = await res.json()
      if(data.length < 1){
        setSubCategory(undefined)
      }else{
        setSubCategory(data)
      }
    },[categoryChoosen,newData])

    const deleteCategory = useCallback(async(subCategory:any)=>{
      const res = await fetch("http://localhost:3000/sub-category/deleteSubCategory",
          {
              method:"Post",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify(subCategory)
          },         
      )
      const data = await res.json()
      if(data.status === 201){
        return toast({
          title: data.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position:"top"
        })
      }
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
      const res = await fetch("http://localhost:3000/sub-category/updateSubCategory",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(editvalues)
      })
      const data =  await res.json()
      setEditValues({_id:"",categoryName:""})
      setOpenModal(false)
      if(data.status === 201){
        return toast({
          title: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position:"top"
          })
  }},[editvalues,setEditValues,toast])

    useEffect(()=>{
      getCategory()
      getsubCategory()
    },[createSubCategory,getsubCategory,editCategory])

    useEffect(()=>{
      if(categoryChoosen!=="Choose Category"){
           getsubCategory()
      }
    },[categoryChoosen,deleteCategory,getsubCategory])

  return (
    <div>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>

          <Menu>
  <MenuButton
    px={4}
    py={2}
    transition='all 0.2s'
    borderRadius='md'
    borderWidth='1px'
    _hover={{ bg: 'gray.400' }}
    _expanded={{ bg: 'blue.400' }}
    _focus={{ boxShadow: 'outline' }}
  >
    {categoryChoosen} <ChevronDownIcon />
  </MenuButton>
  <MenuList>
    {categories?.map((val)=>{
      return (
        <MenuItem key={val._id} onClick={()=>{setCategoryChoosen(val.name);setNewData({...newData,categoryId:val._id})}}>{val.name}</MenuItem>
      )
    })}
  </MenuList>
</Menu>

<FormControl>
  <FormLabel>Enter Sub-category name</FormLabel>
  <Input type='text' value={newData.name} onChange={(e)=>setNewData({...newData,name:e.target.value.trimEnd()})} />
</FormControl>
          </ModalBody>
          <Box className='flex flex-row px-9 gap-6 justify-between mb-3 cursor-pointer' onClick={()=>setShowAllCategories(!showAllCategories)}>
          <Text>{showAllCategories ? "Hide":"Show"} all categories</Text>
          {showAllCategories? <ChevronDownIcon boxSize={7}/> :<ChevronRightIcon boxSize={7}/>}
          </Box>
          {showAllCategories ? 
          <Box className='flex flex-col pl-6'>
            {
                subCategory !== undefined ? subCategory?.map((val:any)=>{
                    return (
                        <Box key={val._id} className='flex-row flex justify-between px-5' >
                    <Text className='border-gray-900 border-b-2 w-52' >{val.name}</Text>
                    <Box className='flex flex-row justify-between w-14 cursor-pointer'>
                        <EditIcon boxSize={5} onClick={()=>{setOpenModal(true),setEditValues({...editvalues,_id:val._id})}}/>
                        <DeleteIcon boxSize={5}  onClick={()=>deleteCategory(val)}/>
                    </Box>
                    </Box>
                )
            }
        ):<Text className='text-center'>{"No data found"}</Text>
      }
            </Box>
        :""}
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={createSubCategory}>
              create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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

export default CreateSubCategory
