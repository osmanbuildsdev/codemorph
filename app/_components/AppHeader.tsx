import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import ProfileAvatar from './ProfileAvatar'
import Image from 'next/image'

function AppHeader({ hideSidebar = false }) {
    return (
        <div className='p-4 shadow-sm flex items-center justify-between w-full '>
            {!hideSidebar ? <SidebarTrigger /> :
                <div>
                    <h2 className='font-bold text-xl text-gray-800'>Code Morph</h2>
                </div>
            }
            <ProfileAvatar />
        </div>
    )
}

export default AppHeader