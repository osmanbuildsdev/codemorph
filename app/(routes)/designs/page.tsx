"use client"
import { useAuthContext } from '@/app/provider'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DesignCard from './_components/DesignCard';
import { RECORD } from '@/app/view-code/[uid]/page';

function Designs() {
    const { user } = useAuthContext();
    const [wireframeList, setWireframeList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        user && GetAllUserWireframe();
    }, [user])

    const GetAllUserWireframe = async () => {
        try {
            setLoading(true);
            const result = await axios.get('/api/wireframe-to-code?email=' + user?.email);
            console.log(result.data);
            setWireframeList(result.data || []);
        } catch (error) {
            console.error('Error fetching wireframes:', error);
            setWireframeList([]);
        } finally {
            setLoading(false);
        }
    }
    
    // Silinen tasarımı listeden kaldır
    const handleDeleteDesign = (uid: string) => {
        setWireframeList(prevList => prevList.filter((item: any) => item.uid !== uid));
    }

    return (
        <div className='xl:px-20 px-6 py-8'>
            <div className="mb-10">
                <h1 className='font-bold text-4xl text-gray-800 mb-3'>
                    My Designs
                </h1>
                <p className='text-lg text-gray-600 max-w-2xl'>
                    View and manage all your generated wireframe designs and their code.
                </p>
            </div>

            {loading ? (
                <div className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading your designs...</p>
                </div>
            ) : wireframeList.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No designs yet</h3>
                    <p className="text-gray-500 mb-6">Create your first wireframe design to see it here</p>
                    <a href="/dashboard" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        Create New Design
                    </a>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {wireframeList?.map((item: RECORD, index) => (
                        <DesignCard 
                            key={item.uid || index} 
                            item={item}
                            onDelete={handleDeleteDesign}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Designs