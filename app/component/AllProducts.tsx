import { Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Card from './Card';
import { ObjectId } from 'mongoose';

type ProductType = {
  _id:string,
  name:string,
  description:string,
  price:number,
  Tags:string[],
  bannerImage:string,
  subCategoryId:string
};

const AllProducts = () => {
    const [allProducts,setAllProducts] = useState<ProductType[]>([])

    const getAllProducts = async () =>{
        const res = await fetch('https://nest-e-comm.vercel.app/E-comm/getAllProducts')
        const data = await res.json()
        data?setAllProducts(data):""
    }
    useEffect(()=>{
        getAllProducts()
    },[])
  return (
    <div>
      <h1 className='text-center'>All Products</h1>
      <Box className='flex flex-row gap-5 items-start justify-start px-10 w-fit flex-wrap'>
        {
            allProducts?.map((val)=>{
                return (
                  <Box key={val._id} className='flex flex-row min-h-80 '>
                    <Card 
                    name={val.name} bannerImage={val.bannerImage} description={val.description} Tags={val.Tags} price={val.price} _id={val._id} subCategoryId={val.subCategoryId}  />
                  </Box>
                )
            })
        }
      </Box>
    </div>
  )
}

export default AllProducts
