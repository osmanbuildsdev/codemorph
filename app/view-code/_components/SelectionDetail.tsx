import React from 'react'
import { RECORD } from '../[uid]/page'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'

function SelectionDetail({ record, regenrateCode, isReady }: any) {
    return record && (
        <div className='p-5 border border-gray-200 rounded-lg shadow-sm bg-white'>
            <h2 className='text-lg font-medium text-gray-800 mb-3'>Wireframe</h2>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-5">
                <Image src={record?.imageUrl} alt='Wireframe' width={300} height={400}
                    className='object-contain h-[200px] w-full'
                />
            </div>

            <div className="space-y-4">
                <div>
                    <h2 className='text-sm font-medium text-gray-600 mb-1.5'>AI Model</h2>
                    <Input defaultValue={record?.model} disabled={true} className='bg-gray-50' />
                </div>

                <div>
                    <h2 className='text-sm font-medium text-gray-600 mb-1.5'>Description</h2>
                    <Textarea defaultValue={record?.description} disabled={true}
                        className='bg-gray-50 h-[160px] resize-none' />
                </div>
            </div>

            <Button 
                className='mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white' 
                disabled={!isReady} 
                onClick={() => regenrateCode()}
            > 
                <RefreshCcw className="mr-2 h-4 w-4" /> Kodu Yeniden Oluştur
            </Button>
        </div>
    )
}

export default SelectionDetail