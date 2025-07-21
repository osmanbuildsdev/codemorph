"use client"
import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Credits() {

    const { user } = useAuthContext();
    const [userData, setUserData] = useState<any>();
    useEffect(() => {
        user && GetUserCredits();
    }, [user])

    const GetUserCredits = async () => {
        const result = await axios.get('/api/user?email=' + user?.email);
        console.log(result.data)
        setUserData(result.data);
    }

    const [selectedPlan, setSelectedPlan] = useState('basic');
    const [formData, setFormData] = useState({
        name: '',
        email: user?.email || '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // E-posta ile iletişim için API endpoint'i (bu kısmı gerçek bir API endpoint ile değiştirin)
            const payloadToSend = {
                name: formData.name,
                email: formData.email,
                message: formData.message,
                selectedPlan: selectedPlan === 'basic' ? 'Başlangıç' : selectedPlan === 'standard' ? 'Standart' : 'Premium',
                userId: user?.uid,
                userEmail: user?.email,
                timestamp: new Date().toISOString()
            };
            
            // Verileri konsola yazdıralım (test amaçlı)
            console.log("Gönderilen form verileri:", payloadToSend);
            
            // Normalde burada bir API çağrısı olacak, örneğin:
            // const response = await axios.post('/api/purchase-credits', payloadToSend);
            
            // Şimdilik başarılı bir gönderim simülasyonu yapalım
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Form başarıyla gönderildi
            setIsSubmitting(false);
            setIsSubmitted(true);
            // Form gönderildikten sonra mesaj alanını temizle
            setFormData(prev => ({ ...prev, message: '' }));
            
            // Gerçek bir uygulamada verileri bir DB'ye kaydedebiliriz
            // Bu örnek için form verilerini tarayıcının yerel depolama alanında saklayalım
            localStorage.setItem('creditPurchaseRequest', JSON.stringify(payloadToSend));
            
        } catch (error) {
            console.error("Form gönderimi sırasında hata:", error);
            setIsSubmitting(false);
            alert("Form gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Kredilerim</h1>
            
            {/* Mevcut Krediler Kartı */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-medium text-gray-700">Mevcut Kredilerim</h2>
                        <div className="mt-2 flex items-baseline">
                            <span className="text-4xl font-bold text-blue-600">{userData?.credits || 0}</span>
                            <span className="ml-2 text-gray-500">kalan kredi</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Her kredi bir wireframe-to-code dönüşümü için kullanılır.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center 
                                                       ${i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-green-500' : 'bg-purple-500'}`}>
                                </div>
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">3 farklı AI modeli kullanabilirsiniz</span>
                    </div>
                </div>
            </div>
            
            {/* Kredi Paketleri */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Kredi Paketi Seçin</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Temel Paket */}
                <div 
                    className={`border rounded-xl p-6 transition-all cursor-pointer ${selectedPlan === 'basic' 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                    onClick={() => setSelectedPlan('basic')}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Başlangıç</h3>
                        {selectedPlan === 'basic' && (
                            <div className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                                Seçildi
                            </div>
                        )}
                    </div>
                    <div className="flex items-baseline mb-4">
                        <span className="text-3xl font-bold">₺199</span>
                        <span className="text-gray-500 ml-2">/paket</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">10 Kredi</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">Tüm AI Modelleri</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">E-posta Desteği</span>
                        </li>
                    </ul>
                </div>
                
                {/* Standart Paket */}
                <div 
                    className={`border rounded-xl p-6 transition-all cursor-pointer ${selectedPlan === 'standard' 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                    onClick={() => setSelectedPlan('standard')}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Standart</h3>
                        <div className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                            {selectedPlan === 'standard' ? 'Seçildi' : 'En Popüler'}
                        </div>
                    </div>
                    <div className="flex items-baseline mb-4">
                        <span className="text-3xl font-bold">₺499</span>
                        <span className="text-gray-500 ml-2">/paket</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">30 Kredi</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">Öncelikli Erişim</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">Özel Destek</span>
                        </li>
                    </ul>
                </div>
                
                {/* Premium Paket */}
                <div 
                    className={`border rounded-xl p-6 transition-all cursor-pointer ${selectedPlan === 'premium' 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                    onClick={() => setSelectedPlan('premium')}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Premium</h3>
                        {selectedPlan === 'premium' && (
                            <div className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                                Seçildi
                            </div>
                        )}
                    </div>
                    <div className="flex items-baseline mb-4">
                        <span className="text-3xl font-bold">₺899</span>
                        <span className="text-gray-500 ml-2">/paket</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">75 Kredi</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">7/24 Öncelikli Destek</span>
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-gray-600">Özelleştirilmiş Çözümler</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            {/* Kredi Satın Alma Formu */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Kredi Satın Al</h2>
                <p className="text-gray-600 mb-2">
                    Kredi satın almak için lütfen aşağıdaki formu doldurun. Ekibimiz en kısa sürede sizinle iletişime geçecektir.
                </p>
                <p className="text-sm text-blue-600 italic mb-6">
                    Form bilgileriniz güvenli bir şekilde işlenir ve ekibimiz tarafından değerlendirilir.
                </p>
                
                {isSubmitted ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
                        <div className="flex">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <div>
                                <p className="font-medium">Talebiniz başarıyla alındı!</p>
                                <p className="text-sm mb-2">Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
                                <p className="text-sm text-gray-600">
                                    Not: Kredi talepleriniz ekibimize iletilir ve ödeme detayları için sizinle 
                                    en kısa sürede iletişime geçilecektir.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresiniz</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mesajınız (İsteğe bağlı)</label>
                            <textarea 
                                id="message" 
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={4} 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Özel istekleriniz veya sorularınız varsa belirtebilirsiniz..."
                            ></textarea>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center">
                                <div className="font-medium mr-2">Seçilen Paket:</div>
                                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                    {selectedPlan === 'basic' ? 'Başlangıç' : selectedPlan === 'standard' ? 'Standart' : 'Premium'}
                                </span>
                            </div>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className='bg-blue-600 hover:bg-blue-700 text-white'
                            >
                                {isSubmitting ? 'Gönderiliyor...' : 'Satın Alma Talebi Gönder'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
            
            {/* SSS */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sıkça Sorulan Sorular</h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="font-medium text-lg mb-2">Krediler ne kadar süre geçerlidir?</h3>
                        <p className="text-gray-600">Satın aldığınız krediler hesabınızda süresiz olarak geçerlidir. Herhangi bir son kullanma tarihi yoktur.</p>
                    </div>
                    <div>
                        <h3 className="font-medium text-lg mb-2">Ödeme nasıl yapılır?</h3>
                        <p className="text-gray-600">Formu doldurduktan sonra ekibimiz sizinle iletişime geçerek ödeme seçeneklerini paylaşacaktır.</p>
                    </div>
                    <div>
                        <h3 className="font-medium text-lg mb-2">İade politikanız nedir?</h3>
                        <p className="text-gray-600">Kullanılmayan krediler için 7 gün içinde tam iade yapılmaktadır. Detaylı bilgi için bizimle iletişime geçebilirsiniz.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Credits