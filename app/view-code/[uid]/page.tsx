"use client"
import AppHeader from '@/app/_components/AppHeader'
import { api, authHeader } from '@/lib/api'
import { useAuthContext } from '@/app/provider'
import { ArrowLeft, Loader2, LoaderCircle } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import SelectionDetail from '../_components/SelectionDetail'
import CodeEditor from '../_components/CodeEditor'
import { read } from 'fs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export interface RECORD {
    id: number,
    description: string,
    code: any,
    imageUrl: string,
    model: string,
    createdBy: string,
    uid: string
}

function ViewCode() {

    const { uid } = useParams();
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [codeResp, setCodeResp] = useState('');
    const [record, setRecord] = useState<RECORD | null>();
    const [isReady, setIsReady] = useState(false);
    // const [isExistingCode,setIsExistingCode]=useState();
    useEffect(() => {
        if (typeof window !== undefined) {
            uid && user && GetRecordInfo();

        }
    }, [uid, user])

    const GetRecordInfo = async (regen = false) => {
        console.log("RUN...")
        setIsReady(false);
        setCodeResp('');
        setLoading(true)

        const result = await api.get('/api/wireframe-to-code?uid=' + uid)

        const resp = result?.data;
        setRecord(result?.data)

        if (resp?.code == null || regen) {
            GenerateCode(resp);
        }
        else {
            setCodeResp(resp?.code?.resp);
            setLoading(false);
            setIsReady(true);
        }
        if (resp?.error) {
            console.log("No Record Found")
        }
        // setLoading(false);
    }

    const GenerateCode = async (record: RECORD) => {
        setLoading(true)
        const res = await fetch('/api/ai-model', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
            body: JSON.stringify({ uid: record?.uid })
        });

        if (!res.body) return;
        setLoading(false);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = (decoder.decode(value)).replace('```jsx', '').replace('```javascript', '').replace('javascript', '').replace('jsx', '').replace('```', '');
            setCodeResp((prev) => prev + text);
            console.log(text);

        }

        setIsReady(true);
        UpdateCodeToDb();
    }

    useEffect(() => {
        if (codeResp != '' && record?.uid && isReady && record?.code == null) {
            UpdateCodeToDb();
        }
    }, [codeResp && record && isReady])


    const UpdateCodeToDb = async () => {
        console.log(record)
        const result = await api.put('/api/wireframe-to-code', {
            uid: record?.uid,
            codeResp: { resp: codeResp }
        });

        console.log(result);
    }



    return (
        <div className="min-h-screen bg-white">
            <AppHeader hideSidebar={true} />
            <div className="max-w-[1400px] mx-auto px-4 py-6">
                <div className="mb-5">
                    <Button variant="outline" asChild className="gap-2 hover:bg-blue-50 transition-colors">
                        <Link href="/dashboard">
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Dashboard'a Dön</span>
                            <span className="sm:hidden">Dashboard</span>
                        </Link>
                    </Button>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-[320px] shrink-0">
                        {/* Selection Details  */}
                        <SelectionDetail record={record} regenrateCode={() => { GetRecordInfo(true) }}
                            isReady={isReady}
                        />
                    </div>
                    <div className="flex-1">
                        {/* Code Editor  */}
                        {loading ? 
                            <div className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg h-[70vh]">
                                <div className="text-center">
                                    <Loader2 className="animate-spin h-8 w-8 mb-2 mx-auto text-blue-500" /> 
                                    <h2 className="font-medium text-xl text-gray-700">Wireframe Analiz Ediliyor...</h2>
                                </div>
                            </div> :
                            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                <CodeEditor codeResp={codeResp} isReady={isReady} />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewCode