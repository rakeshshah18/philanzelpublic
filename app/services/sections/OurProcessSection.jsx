"use client"
import { useEffect, useState } from "react"
import { DollarSign, Users, Globe, Building } from "lucide-react"
import { getImageUrl, handleImageError, logImageDebug } from "@/lib/imageUtils"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export default function OurProcessSection({ section }) {
    const [data, setData] = useState(section || null)
    const [loading, setLoading] = useState(!section)
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!section) {
            fetch(`${BASE_URL}/api/partner/our-process/public`)
                .then(res => {
                    if (!res.ok) throw new Error(`Network response was not ok: ${res.statusText}`);
                    return res.json();
                })
                .then(result => {
                    if (result.status === "success" && result.data && result.data.length > 0) {
                        setData(result.data[0])
                        logImageDebug("OurProcessSection", result.data[0].images);
                    } else {
                        throw new Error(result.message || 'Failed to fetch data');
                    }
                })
                .catch(err => {
                    console.error("Error fetching OurProcessSection data:", err);
                    setError(err.message);
                })
                .finally(() => setLoading(false))
        }
    }, [section])

    if (loading) return <section className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4"><p className="text-gray-600">Loading...</p></div></section>
    if (error) return <section className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4"><p className="text-red-500">Error: {error}</p></div></section>;
    if (!data) return null;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="w-fit mx-auto text-sm font-semibold text-cyan-600 tracking-wide mb-2 text-center border-2 border-cyan-100 bg-cyan-50 px-4 py-1 rounded">
                    OUR PROCESS
                </p>
                <h2 className="text-4xl font-serif font-black text-gray-900 mb-6 text-center">{data.heading?.[0] || data.title || "Our Process"}</h2>
                <div className="text-lg text-gray-600 mb-10 text-center" dangerouslySetInnerHTML={{ __html: data.description?.[0] || "" }} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(() => {
                        const stepsArr = data.steps || data.process || data.items || data.list || [];
                        if (Array.isArray(stepsArr) && stepsArr.length > 0) {
                            return stepsArr.map((step, i) => (
                                <div key={i} className="bg-cyan-50 rounded-lg shadow p-8 flex flex-col items-center text-center">
                                    <div className="mb-4 text-cyan-600">
                                        {step.staticIcon === "DollarSign" && <DollarSign size={36} />}
                                        {step.staticIcon === "Users" && <Users size={36} />}
                                        {step.staticIcon === "Globe" && <Globe size={36} />}
                                        {step.staticIcon === "Building" && <Building size={36} />}
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">{step.name || step.title || step.text || step.heading}</h4>
                                    <p className="text-gray-600 text-sm">{step.description || step.title || step.text || step.heading}</p>
                                </div>
                            ));
                        }
                        const imagesArr = data.images || [];
                        const count = Math.max(subheadingArr.length, subdescriptionArr.length, imagesArr.length);
                        if (count > 0) {
                            return Array.from({ length: count }).map((_, i) => {
                                // Handle both string URLs and image objects
                                const imageData = imagesArr[i];
                                let imageUrl = null;
                                
                                if (!imageData) {
                                    imageUrl = null;
                                } else if (typeof imageData === 'string') {
                                    // Direct string URL
                                    imageUrl = imageData;
                                } else if (typeof imageData === 'object' && imageData.url) {
                                    // Image object with url property
                                    imageUrl = imageData.url;
                                }
                                
                                console.log(`OurProcessSection image ${i}:`, { imageData, imageUrl });
                                
                                return (
                                    <div key={i} className="bg-cyan-50 rounded-lg shadow p-8 flex flex-col items-center text-center">
                                        {imageUrl && (
                                            <img
                                                src={imageUrl}
                                                alt={subheadingArr[i] || `Step ${i + 1}`}
                                                className="mb-4 rounded-lg w-20 h-20 object-cover"
                                                onError={(e) => {
                                                    console.error(`OurProcessSection image ${i} failed to load:`, imageUrl);
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <h4 className="font-bold text-lg mb-2">{subheadingArr[i] || `Step ${i + 1}`}</h4>
                                        <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: subdescriptionArr[i] || "" }} />
                                    </div>
                                );
                            });
                        }
                        return <div className="text-gray-500 col-span-4">No steps found.</div>;
                    })()}
                </div>
            </div>
        </section>
    )
}
