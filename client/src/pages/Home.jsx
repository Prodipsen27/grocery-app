import React from 'react'
import Banner from '../components/Banner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <div className='mt-16'>
      <Banner/>
      <Categories/>
      <BestSeller/>
      <BottomBanner/>
      <NewsLetter/>
    </div>
  )
}

export default Home
