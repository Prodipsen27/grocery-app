import React, { useState } from 'react'
import { assets } from '../assets/assets'

const InputField = ({ label, type, placeholder, name, handleChange, address }) => (
  <div className="flex flex-col gap-1">
    <label className="text-gray-600 font-medium text-sm capitalize">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
      name={name}
      value={address[name]}
      required
      className="w-full border border-gray-300 px-4 py-2 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
    />
  </div>
)

const AddAddress = () => {
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }))
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()
    console.log('Submitted Address:', address)
    // Add logic to save address
  }

  return (
    <div className="mt-24 pb-16 px-6">
      <p className="text-2xl md:text-3xl text-gray-600 font-semibold mb-6">
        Add Shipping <span className="text-green-600">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between gap-10">
        <form
          onSubmit={onSubmitHandler}
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="First Name" handleChange={handleChange} address={address} name="firstName" type="text" placeholder="John" />
            <InputField label="Last Name" handleChange={handleChange} address={address} name="lastName" type="text" placeholder="Doe" />
            <InputField label="Email" handleChange={handleChange} address={address} name="email" type="email" placeholder="john@example.com" />
            <InputField label="Phone" handleChange={handleChange} address={address} name="phone" type="tel" placeholder="+91 23456 78900" />
            <InputField label="Street" handleChange={handleChange} address={address} name="street" type="text" placeholder="123 Main St" />
            <InputField label="City" handleChange={handleChange} address={address} name="city" type="text" placeholder="City" />
            <InputField label="State" handleChange={handleChange} address={address} name="state" type="text" placeholder="State" />
            <InputField label="Zip Code" handleChange={handleChange} address={address} name="zipcode" type="text" placeholder="12345" />
            <InputField label="Country" handleChange={handleChange} address={address} name="country" type="text" placeholder="Country" />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-medium text-lg hover:bg-green-700 transition"
          >
            Save Address
          </button>
        </form>

        <div className="flex justify-center md:justify-end">
          <img
            src={assets.add_address_iamge}
            alt="Address"
            className="w-72 h-auto md:mr-16 object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default AddAddress
