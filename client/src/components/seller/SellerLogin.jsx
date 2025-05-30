import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'

const SellerLogin = () => {
const { isSeller, setIsSeller, navigate } = useAppContext()
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const onSubmitHandler = async (e) => {
e.preventDefault()


// Basic validation (you can replace with real login logic)
if (email.trim() && password.trim()) {
  setIsSeller(true)
} else {
  alert('Please enter both email and password')
}


}

useEffect(() => {
if (isSeller) {
navigate('/seller')
}
}, [isSeller])

return (
!isSeller && ( <div className="flex justify-center items-center min-h-screen bg-gray-50"> <form
       onSubmit={onSubmitHandler}
       className="w-full max-w-sm p-8 bg-white shadow-lg rounded-xl"
     > <h2 className="text-2xl font-bold text-center mb-6"> <span className="text-green-600">Seller</span> Login </h2>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
      >
        Login
      </button>
    </form>
  </div>
)


)
}

export default SellerLogin

