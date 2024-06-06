import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import { Box, Button, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'

interface productType  {
    _id:string,
    name:string,
    description:string,
    price:number,
    Tags:string[],
    bannerImage:string,
    subCategoryId:string
    }


const Card = (props:productType) => {
  const [openEditModal,setOpenEditModal] = useState(false)
  const [loading,setloading] = useState(false)
  const [productDetails , setProductDetails] = useState<any>({
    _id:props._id,
    name: props.name,
    description: props.description,
    price: props.price,
    Tags:props.Tags,
  })

  const handleTags = (e:string)=> {
    const one = e.split(",")
    setProductDetails({...productDetails,Tags:one})
  }

    const [deleteData,setDeleteData] = useState<any>({
        _id:"",
        subCategoryId:"",
        secure_url:"",
    })

    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const deleteProduct = (async ()=>{
      const res = await fetch("https://nest-e-comm.vercel.app/e-comm/deleteProduct",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(deleteData)
      })
      const data = await res.json()
      if(data.status){
        toast({
          title:data.message,
          status:data.status === 200 ?"success":"error",
          duration:2000,
          isClosable:true,
          position:"top",
        })
        window.location.reload()
      }
    })

    const updateProduct = (async ()=>{
      if(productDetails.name === "" || productDetails.description === "" || productDetails.price === "" || productDetails.Tags === ""){
        return toast({
          title:"kindly fill all the fields",
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position:"top"
        })
      }
      setloading(true)
      const res = await fetch("https://nest-e-comm.vercel.app/e-comm/updateProduct",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(productDetails)
        })
        const data = await res.json()
        if(data.status){
          setloading(false)
          toast({
            title:data.message,
            status:data.status === 200 ?"success":"error",
            duration:2000,
            isClosable:true,
            position:"top",
          })
          window.location.reload()
        }
    })

    const updateImage = (async(e:any)=>{
      if(!e.target.files || e.target.files.length === 0)return
      setloading(true)
      const file = new FormData();
      file.append("file",e.target.files[0])
      file.append("_id",props._id)
      const res = await fetch("https://nest-e-comm.vercel.app/e-comm/updateImage",{
        method:"POST",
        body:file
      })
      const data = await res.json()
      if(data.status){
        toast({
          title:data.message,
          status:data.status === 200 ?"success":"error",
          duration:2000,
          isClosable:true,
          position:"top",
        })
        setloading(false)
        window.location.reload()
      }
    })

  return (
    <Box className='border border-slate-300   w-full p-5 rounded-lg bg-slate-100 pb-5'>
      <Box id='image' className='relative'>
        <EditIcon className='relative -top-3 active:text-black' boxSize={5} color={'GrayText'} onClick={()=>{setOpenEditModal(true)}} />
        <CloseIcon  className='relative z-10 -top-3 left-40 text-gray-200 cursor-pointer -my-2 active:text-black' color={'GrayText'} onClick={()=>{onOpen();setDeleteData({...deleteData,_id:props._id,subCategoryId:props.subCategoryId,secure_url:props.bannerImage.split("/")[7].split(".")[0]})}} />
        <Image src={props.bannerImage} height={200} width={200} className='relative' alt='product image'/>
      </Box>
        <Box className='w-48'>
            <Text noOfLines={1} className='text-black text-center font-extrabold text-lg text-wrap'>{props.name}</Text>
            <Text noOfLines={1}  className='text-gray-400 text-center'>{props.description}</Text>
            <Text className='text-blue-500 text-center font-semibold'>{props.price}</Text>
        </Box>


        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>confirm Delete the product ?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme='blue' variant={"outline"} mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={deleteProduct}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={openEditModal} onClose={()=>setOpenEditModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>enter new product details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
            <Input isRequired placeholder='product name' value={productDetails.name} onChange={(e)=>setProductDetails({...productDetails,name:e.target.value})}/>

          <Input isRequired placeholder='product description' value={productDetails.description} 
          onChange={(e)=>setProductDetails({...productDetails,description:e.target.value})}
          />
          <Input isRequired type='number' placeholder='product price' value={productDetails.price}
          onChange={(e)=>setProductDetails({...productDetails,price:e.target.value})} 
          />
          <Input placeholder='product tags eg :- tag1 , tag2 , tag3' value={productDetails.Tags}
          onChange={(e)=>{handleTags(e.target.value)}}/>
          <input required={true} className='py-3 pl-5'  type='file'  onChange={(e)=>{updateImage(e)}} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' variant={"outline"} mr={3} onClick={()=>setOpenEditModal(false)}>close</Button>
            <Button colorScheme='green' onClick={updateProduct} isLoading={loading}>Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  )
}

export default Card
