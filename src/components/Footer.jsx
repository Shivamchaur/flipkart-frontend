import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full bg-gray-900 text-white py-8'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          <div>
            <h3 className='text-lg font-bold mb-4'>About Us</h3>
            <p className='text-gray-300 text-sm'>Your trusted online shopping destination</p>
          </div>
          <div>
            <h3 className='text-lg font-bold mb-4'>Quick Links</h3>
            <ul className='text-gray-300 text-sm space-y-2'>
              <li><a href='#' className='hover:text-white transition'>Help Center</a></li>
              <li><a href='#' className='hover:text-white transition'>Track Orders</a></li>
              <li><a href='#' className='hover:text-white transition'>Returns</a></li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-bold mb-4'>Customer Service</h3>
            <ul className='text-gray-300 text-sm space-y-2'>
              <li><a href='#' className='hover:text-white transition'>Contact Us</a></li>
              <li><a href='#' className='hover:text-white transition'>Privacy Policy</a></li>
              <li><a href='#' className='hover:text-white transition'>Terms & Conditions</a></li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-bold mb-4'>Follow Us</h3>
            <div className='flex gap-4'>
              <a href='#' className='text-gray-300 hover:text-white transition'>Facebook</a>
              <a href='#' className='text-gray-300 hover:text-white transition'>Twitter</a>
              <a href='#' className='text-gray-300 hover:text-white transition'>Instagram</a>
            </div>
          </div>
        </div>
        <div className='border-t border-gray-700 pt-8 text-center text-gray-400 text-sm'>
          <p>&copy; 2026 Flipkart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer