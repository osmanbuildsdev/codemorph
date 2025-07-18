import { RECORD } from '@/app/view-code/[uid]/page'
import { Button } from '@/components/ui/button'
import Constants from '@/data/Constants'
import { Code, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'

function DesignCard({ item, onDelete }: { item: RECORD, onDelete?: (uid: string) => void }) {
    const modelObj = item && Constants.AiModelList.find((x => x.name == item?.model))
    const [isDeleting, setIsDeleting] = useState(false);
    
    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!window.confirm('Bu tasarımı silmek istediğinizden emin misiniz?')) {
            return;
        }
        
        try {
            setIsDeleting(true);
            const response = await axios.delete(`/api/wireframe-to-code?uid=${item.uid}`);
            
            if (response.data.success) {
                toast.success('Tasarım başarıyla silindi');
                // Ebeveyn bileşene silme işlemini bildir
                if (onDelete) {
                    onDelete(item.uid);
                }
            } else {
                toast.error('Silme işlemi başarısız oldu');
            }
        } catch (error) {
            console.error('Error deleting design:', error);
            toast.error('Tasarım silinirken bir hata oluştu');
        } finally {
            setIsDeleting(false);
        }
    };
    
    return (
        <div className='p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white relative'>
            {/* Silme butonu - sağ üst köşede */}
            <button 
                onClick={handleDelete}
                className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-red-50 rounded-full border border-gray-200 shadow-sm transition-colors"
                title="Tasarımı sil"
                disabled={isDeleting}
            >
                <Trash2 className={`w-4 h-4 ${isDeleting ? 'text-gray-400' : 'text-red-500'}`} />
            </button>

            <div className="relative overflow-hidden rounded-lg mb-4">
                <Image src={item?.imageUrl || '/placeholder-image.png'} alt='wireframe preview'
                    width={300} height={200}
                    className='w-full h-[200px] object-cover bg-gray-50'
                />
            </div>

            <div className='space-y-4'>
                <div className="min-h-[60px]">
                    <p className='line-clamp-3 text-gray-600 text-sm leading-relaxed'>
                        {item?.description || 'No description available'}
                    </p>
                </div>
                
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full border border-gray-100'>
                        {modelObj?.icon && (
                            <Image 
                                src={modelObj.icon} 
                                alt={modelObj.name || 'AI Model'}
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                            {modelObj?.name || 'Unknown Model'}
                        </span>
                    </div>
                    
                    <Link href={'/view-code/' + item?.uid}>
                        <Button className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2'>
                            <Code className="w-4 h-4" />
                            View Code
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default DesignCard