"use client"
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Alert, AlertIcon, AlertTitle, Box, Button, FormControl, FormLabel, Input, InputGroup, InputLeftElement, InputRightElement, Menu, MenuButton, MenuItem, MenuList, ModalCloseButton, ModalFooter, ModalHeader, Stack, useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import Loading from './Loading'
import { Modal, ModalBody, ModalContent, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'



const CreateProduct = (props:any)  => {
  const [category,setCategory] = useState("choose category");
  const [allCategories,setAllCategories] = useState<any[]>()
  const [allSubCategories,setAllSubCategories] = useState<any[]>()
  const [isLoading,setIsLoading] = useState(false)
  const [subCategory,setSubCategory] = useState("choose sub category");
  const [imagePath,setImagePath] = useState<any>([])
  const [bannerurl,setbannerurl] = useState("")
  const [productDetails , setProductDetails] = useState<any>({
    name: '',
    description: '',
    price: '',
    Tags:[],
    bannerImage:'',
    categoryId:'',
    subCategoryId:'',
  })
  const toast = useToast()
  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = React.useState(<OverlayOne />)

  const getCategories = async()=>{
    const res = await fetch("https://nest-e-comm.vercel.app/category/getAll")
    const data = await res.json()
    setAllCategories(data)
}

const getSubCategories = useCallback(async()=>{
  const res = await fetch(`https://nest-e-comm.vercel.app/sub-category/getAllSubCategory?id=${productDetails.categoryId}`)
  const data = await res.json()
  if(data.length > 0){
    setAllSubCategories(data)
  }else{
    setAllSubCategories(undefined)
  }
},[productDetails])

useEffect(()=>{
      getSubCategories()
},[getCategories,getSubCategories])
 
  useEffect(()=>{
    getCategories()
  },[])
  
  const handleTags = (e:string)=> {
    const one = e.split(",")
    setProductDetails({...productDetails,Tags:one})
  }

  const uplaodBannerImage = async (i:any,id:string)=>{
    const formData = new FormData()
    formData.append("file",i)
      const res = await fetch(`https://nest-e-comm.vercel.app/e-comm/uploadImage/${id}`,{
        method:"POST",
        body:formData     
  })
    const data = await res.json()
    if(data.status === 401){
      setIsLoading(false)
      return toast({
        title: data.message,
        status: "error",
        duration: 3000,
        isClosable:true
      })
    }
    if(data.status === 200){
      setIsLoading(false)
      return toast({
        title: data.message,
        status: "success",
        duration: 3000,
        isClosable:true
      })
    }
  }
  


const sendData = async (e:any)=> {
  if(productDetails.name === "")
    {
      return toast({
        title:"kindly fill all the fields",
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position:"top"
      })
    }
  setIsLoading(true)
    const res = await fetch("https://nest-e-comm.vercel.app/e-comm/createNewProduct",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify(productDetails)
    })
    const data = await res.json()
    if(data.status === 401){
      setIsLoading(false)
      return toast({
        title: data.message,
        status: "error",
        duration: 3000,
        isClosable:true,
        position:"top",
      })
    }
    if(data._id){
      uplaodBannerImage(e,data._id)
    }else{
      setIsLoading(false)
      return toast({
        title: "some error occured",
        status: "error",
        duration: 3000,
        isClosable:true,
        position:"top"
        })
    }
  }

  
useEffect(()=>{
  onOpen()
},[props.modal,onOpen])

  return (
    <Box>
        <Box>
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Create new Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
      <Box>
      <Box id='category'>
      <Menu>
  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
    {category}
  </MenuButton>
  <MenuList>
    {allCategories?.map((val)=>{
      return (
        <MenuItem key={val._id} onClick={()=>{setCategory(val.name);setProductDetails({...productDetails,categoryId:val._id})}}>{val.name}</MenuItem>
      )
    })}
  </MenuList>
</Menu>
      </Box>
      <Box id='subCategory' className='mt-5'>
      <Menu>
  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
    {subCategory}
  </MenuButton>
  <MenuList>
    {allSubCategories !== undefined ? allSubCategories?.map((val)=>{
      return (
        <MenuItem key={val._id} onClick={()=>{setSubCategory(val.name);setProductDetails({...productDetails,subCategoryId:val._id})}}>{val.name}</MenuItem>
      )
    }):<MenuItem>{category === "choose category" ? "Kindly choose a category first" : "No data found"}</MenuItem>}
  </MenuList>
</Menu>
</Box>
{
  category !== "choose category" && subCategory !== "choose sub category" &&
      <Box className='mt-5'>
        <Stack>

            <FormLabel>Product Details</FormLabel>
        <FormControl isRequired>
          <Input placeholder='product name' value={productDetails.name} onChange={(e)=>setProductDetails({...productDetails,name:e.target.value})}/>
            </FormControl>

          <Input isRequired placeholder='product description' value={productDetails.description} 
          onChange={(e)=>setProductDetails({...productDetails,description:e.target.value})}
          />
          <Input isRequired type='number' placeholder='product price' value={productDetails.price}
          onChange={(e)=>setProductDetails({...productDetails,price:e.target.value})} 
          />
          <Input placeholder='product tags eg :- tag1 , tag2 , tag3'
          onChange={(e)=>{handleTags(e.target.value)}}/>
          <input required={true} className='py-3 pl-5'  type='file'  onChange={(e)=>{setImagePath(e.target.files)}} />
          <Button type='submit'  colorScheme='green' className='bg-green' onClick={()=>{sendData(imagePath[0])}} isLoading={isLoading} loadingText={"creating product"} >
            Submit
            </Button>
        </Stack>
        </Box>
}
  </Box>
          </ModalBody>
        </ModalContent>
        </Modal>
        </Box>

</Box>
)
}


export default CreateProduct
