"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CloudUpload, Loader2Icon, WandSparkles, X } from 'lucide-react'
import Image from 'next/image'
//@ts-ignore
import uuid4 from "uuid4";
import React, { ChangeEvent, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/configs/firebaseConfig'
import { api } from '@/lib/api'
import { uuid } from 'drizzle-orm/pg-core'
import { useAuthContext } from '@/app/provider'
import { useRouter } from 'next/navigation'
import Constants from '@/data/Constants'
import { toast } from 'sonner'
function ImageUpload() {

    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [file, setFile] = useState<any>();
    const [model, setModel] = useState<string>();
    const [description, setDescription] = useState<string>();
    const { user } = useAuthContext();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const OnImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            console.log(files[0])
            const imageUrl = URL.createObjectURL(files[0]);
            setFile(files[0]);
            setPreviewUrl(imageUrl);
        }
    }

    const OnConverToCodeButtonClick = async () => {
        if (!file || !model || !description) {
            console.log("Select All Field");
            return;
        }
        setLoading(true);
        try {
            //Save Image to Firebase with user-based folder
            const fileName = Date.now() + '.png';
            const imageRef = ref(storage, `Wireframe_To_Code/${user?.uid}/${fileName}`);
            await uploadBytes(imageRef, file).then(resp => {
                console.log("Image Uploaded...")
            });

            const imageUrl = await getDownloadURL(imageRef);
            console.log(imageUrl);

            const uid = uuid4();
            console.log(uid);
            // Save Info To Database
            const result = await api.post('/api/wireframe-to-code', {
                uid: uid,
                description: description,
                imageUrl: imageUrl,
                model: model
            });
            if (result.data?.error) {
                console.log("Not Enough credits");
                toast('Not Enough Credits!');
                setLoading(false);
                return;
            }
            setLoading(false);
            router.push('/view-code/' + uid);
        } catch (error) {
            console.error("Upload Error:", error);
            toast('Error uploading file. Please check Firebase permissions.');
            setLoading(false);
        }
    }

    return (
        <div className='mt-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {!previewUrl ? 
                    <div className='p-8 border-2 border-dashed border-gray-300 rounded-xl shadow-sm bg-gray-50/50
                        flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors duration-200'>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <CloudUpload className='h-8 w-8 text-blue-600' />
                        </div>
                        <h2 className='font-semibold text-xl text-gray-800 mb-2'>Upload Wireframe</h2>
                        <p className='text-gray-500 text-center mb-6 max-w-sm'>
                            Upload your wireframe image to convert it into beautiful, functional code
                        </p>
                        
                        <label htmlFor='imageSelect' className="cursor-pointer">
                            <div className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg 
                                transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg'>
                                <CloudUpload className="w-4 h-4" />
                                Choose Image
                            </div>
                        </label>
                        
                        <p className="text-xs text-gray-400 mt-3">
                            Supports JPG, PNG, WEBP up to 10MB
                        </p>
                        
                        <input type="file" id='imageSelect'
                            className='hidden'
                            multiple={false}
                            accept="image/*"
                            onChange={OnImageSelect}
                        />
                    </div> :
                    <div className='relative p-6 border-2 border-gray-200 rounded-xl shadow-sm bg-white'>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-semibold text-lg text-gray-800">Preview</h3>
                            <button
                                onClick={() => setPreviewUrl(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <X className='w-5 h-5 text-gray-500 hover:text-red-500' />
                            </button>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <Image 
                                src={previewUrl} 
                                alt='wireframe preview' 
                                width={500} 
                                height={500}
                                className='w-full h-[280px] object-contain rounded-lg'
                            />
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-500">Ready to convert! Choose AI model and add description.</p>
                        </div>
                    </div>
                }
                <div className='p-8 bg-white border border-gray-200 shadow-lg rounded-xl'>
                    {/* AI Model Selection */}
                    <div className="mb-8">
                        <div className="mb-4">
                            <h2 className='font-semibold text-xl text-gray-800 mb-2'>Choose AI Model</h2>
                            <p className='text-sm text-gray-500'>Select the AI model that best fits your needs</p>
                        </div>
                        
                        <div className="grid gap-3">
                            {Constants?.AiModelList.map((modelOption, index) => (
                                <div 
                                    key={index}
                                    onClick={() => setModel(modelOption.name)}
                                    className={`
                                        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                                        ${model === modelOption.name 
                                            ? 'border-blue-500 bg-blue-50 shadow-sm' 
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <div className='flex items-center gap-4'>
                                        <div className={`
                                            w-12 h-12 rounded-lg flex items-center justify-center
                                            ${model === modelOption.name ? 'bg-blue-100' : 'bg-gray-50'}
                                        `}>
                                            <Image 
                                                src={modelOption.icon} 
                                                alt={modelOption.name} 
                                                width={28} 
                                                height={28}
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-medium text-base ${
                                                model === modelOption.name ? 'text-blue-700' : 'text-gray-800'
                                            }`}>
                                                {modelOption.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {modelOption.name === 'Gemini Google' && 'Advanced multimodal AI by Google'}
                                                {modelOption.name === 'llama By Meta' && 'Open-source large language model'}
                                                {modelOption.name === 'Deepkseek' && 'High-performance reasoning model'}
                                            </p>
                                        </div>
                                        {model === modelOption.name && (
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description Section */}
                    <div>
                        <div className="mb-4">
                            <h2 className='font-semibold text-xl text-gray-800 mb-2'>Describe Your Webpage</h2>
                            <p className='text-sm text-gray-500'>Provide detailed information about what you want to create</p>
                        </div>
                        <Textarea
                            onChange={(event) => setDescription(event?.target.value)}
                            className='h-[160px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none text-gray-700'
                            placeholder='Describe your webpage in detail... (e.g., "A modern landing page for a tech startup with hero section, features, testimonials, and contact form")'
                        />
                        <div className="mt-2 flex items-center gap-2">
                            <div className="text-xs text-gray-400">
                                💡 Tip: Be specific about layout, colors, and functionality for better results
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-12 flex items-center justify-center'>
                <Button 
                    onClick={OnConverToCodeButtonClick} 
                    disabled={loading || !file || !model || !description}
                    className={`
                        px-8 py-4 text-base font-semibold rounded-xl transition-all duration-200
                        ${loading || !file || !model || !description
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        }
                    `}
                >
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <Loader2Icon className='w-5 h-5 animate-spin' />
                            <span>Generating Code...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <WandSparkles className='w-5 h-5' />
                            <span>Convert to Code</span>
                        </div>
                    )}
                </Button>
                
                {(!file || !model || !description) && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">
                            {!file && "Upload an image, "}
                            {!model && "select an AI model, "}
                            {!description && "add a description "}
                            to continue
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImageUpload