"use client"
import React, { useEffect, useState } from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Calendar, CircleDollarSign, Home, Inbox, Paintbrush, Search, Settings, User, CreditCard, Zap } from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuthContext } from '../provider'
import { api } from '@/lib/api'

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "My Designs",
        url: "/designs",
        icon: Paintbrush,
    },
    {
        title: "Credits",
        url: "/credits",
        icon: CircleDollarSign,
    },

]

export function AppSidebar() {
    const path = usePathname();
    const { user } = useAuthContext();
    const [credits, setCredits] = useState(0);

    useEffect(() => {
        user && fetchUserCredits();
    }, [user]);

    const fetchUserCredits = async () => {
        try {
            const result = await api.get('/api/user');
            setCredits(result.data?.credits || 0);
        } catch (error) {
            console.error('Error fetching credits:', error);
        }
    };

    return (
        <Sidebar className="bg-white border-r border-gray-200">
            <SidebarHeader className="p-6 border-b border-gray-100">
                <div>
                    <h2 className='font-bold text-2xl text-gray-800'>
                        CodeMorph
                    </h2>
                    <p className='text-sm text-gray-500'>AI-Powered Development</p>
                </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Main Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className='space-y-1'>
                            {items.map((item, index) => (
                                <a href={item.url} key={index}
                                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 
                                 ${path == item.url 
                                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                 }`}>
                                    <item.icon className={`h-5 w-5 transition-colors ${
                                        path == item.url ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                                    }`} />
                                    <span>{item.title}</span>
                                </a>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter className="p-4 border-t border-gray-100">
                {/* Credits Section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Credits</p>
                                <p className="text-xs text-gray-500">Available now</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                                {credits}
                            </p>
                        </div>
                    </div>
                    <a href="/credits" className="block w-full">
                        <button className="w-full bg-blue-600 text-white text-xs font-medium py-2.5 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-1.5">
                            <CreditCard className="w-3 h-3" />
                            Get More Credits
                        </button>
                    </a>
                </div>
                
                {/* User Info */}
                <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-4 h-4 text-white" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">
                            {user?.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>
                
                <p className='text-xs text-gray-400 text-center mt-3'>© 2024 CodeMorph</p>
            </SidebarFooter>
        </Sidebar>
    )
}