import React, { useState } from 'react'
import { Sandpack, SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import Constants from '@/data/Constants';
import { githubLight } from "@codesandbox/sandpack-themes";
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

function CodeEditor({ codeResp, isReady }: any) {
    const [isFullPreview, setIsFullPreview] = useState(false);

    return (
        <div className="w-full">
            {/* Full Preview Toggle Butonu */}
            {isReady && (
                <div className="bg-gray-50 border-b border-gray-200 p-2 flex justify-end">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsFullPreview(!isFullPreview)}
                        className="text-xs gap-1 bg-white"
                    >
                        {isFullPreview ? (
                            <>
                                <Minimize2 size={14} />
                                Editör Görünümü
                            </>
                        ) : (
                            <>
                                <Maximize2 size={14} />
                                Tam Ekran Önizleme
                            </>
                        )}
                    </Button>
                </div>
            )}

            {isReady ? (
                isFullPreview ? (
                    <div className={`${isFullPreview ? 'h-[80vh]' : 'h-[600px]'}`}>
                        <SandpackProvider 
                            template="react"
                            theme={githubLight}
                            files={{
                                "/App.js": `${codeResp}`
                            }}
                            customSetup={{
                                dependencies: {
                                    ...Constants.DEPENDANCY
                                }
                            }}
                            options={{
                                externalResources: ["https://cdn.tailwindcss.com"],
                            }}
                        >
                            <SandpackLayout>
                                <SandpackPreview showNavigator style={{ height: '80vh', width: '100%' }} />
                            </SandpackLayout>
                        </SandpackProvider>
                    </div>
                ) : (
                    <Sandpack 
                        template="react"
                        theme={githubLight}
                        options={{
                            externalResources: ["https://cdn.tailwindcss.com"],
                            showNavigator: true,
                            showTabs: true,
                            editorHeight: 600,
                            showLineNumbers: true,
                            wrapContent: true,
                        }}
                        customSetup={{
                            dependencies: {
                                ...Constants.DEPENDANCY
                            }
                        }}
                        files={{
                            "/App.js": `${codeResp}`,
                        }} 
                    />
                )
            ) : (
                <SandpackProvider 
                    template="react"
                    theme={githubLight}
                    files={{
                        "/app.js": {
                            code: `${codeResp}`,
                            active: true
                        }
                    }}
                    customSetup={{
                        dependencies: {
                            ...Constants.DEPENDANCY
                        }
                    }}
                    options={{
                        externalResources: ["https://cdn.tailwindcss.com"],
                    }}
                >
                    <SandpackLayout>
                        <SandpackCodeEditor 
                            showTabs={true} 
                            showLineNumbers={true}
                            wrapContent={true}
                            style={{ height: '70vh' }} 
                        />
                    </SandpackLayout>
                </SandpackProvider>
            )}
        </div>
    )
}

export default CodeEditor