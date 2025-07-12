import React from 'react'
import ImageUpload from './_components/ImageUpload'

function Dashboard() {
    return (
        <div className='xl:px-20 px-6 py-8'>
            <div className="mb-10">
                <h1 className='font-bold text-4xl text-gray-800 mb-3'>
                    Convert  to Code
                </h1>
                <p className='text-lg text-gray-600 max-w-2xl'>
                    Transform your image into beautiful, functional code using AI. 
                    Upload your design and watch it come to life instantly.
                </p>
            </div>
            <ImageUpload />
        </div>
    )
}

export default Dashboard