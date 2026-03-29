import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard';

const AllProducts = () => {

    const {products, searchQuery} = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(()=>{
        if (searchQuery.length > 0) {
            setFilteredProducts(products.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        }else{
            setFilteredProducts(products)
        }
    },[products,searchQuery])

  return (
    <div className='mt-20 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pb-16'>
      <div className='mb-8'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight border-l-4 border-green-500 pl-4'>
          All Products
        </h1>
        <p className='text-sm sm:text-base text-gray-500 mt-1 ml-5'>
          {searchQuery ? `Showing results for "${searchQuery}"` : 'Explore our complete range of fresh groceries'}
        </p>
      </div>
      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredProducts.filter((product)=>product.inStock).map((product,index)=>(
                <ProductCard key={index} product={product}/>
            ))}
        </div>
    </div>
  )
}

export default AllProducts
