'use client'

import { X } from 'lucide-react'
import { useGetWaterRateSlab } from '../hooks'
import { WaterRateSlabResponse } from '../types/IWaterRateSlab'

interface Props {
    waterRateSlab: WaterRateSlabResponse | null
    onClose: () => void
}

const ViewWaterRateSlab = ({ waterRateSlab, onClose }: Props) => {
    const { data: slabs, isLoading, error } = useGetWaterRateSlab(
        waterRateSlab?.id ?? '',
        waterRateSlab !== null,
    )

    if (!waterRateSlab) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-[95vw] overflow-auto rounded-lg bg-white p-6 shadow-lg dark:bg-[#27272a] md:max-w-[85vw] lg:max-w-[75vw]">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Water Rate Slab Details
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{waterRateSlab.name}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl text-red-400 hover:text-red-500"
                        aria-label="Close"
                    >
                        <X strokeWidth={3} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
                    </div>
                ) : error ? (
                    <p className="py-8 text-center text-red-500">
                        {error instanceof Error ? error.message : 'Could not load slab details.'}
                    </p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-[#353535]">
                                <tr>
                                    <th className="px-4 py-3 text-left">Slab</th>
                                    <th className="px-4 py-3 text-left">From unit</th>
                                    <th className="px-4 py-3 text-left">To unit</th>
                                    <th className="px-4 py-3 text-left">Rate per unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {slabs?.map((slab) => (
                                    <tr key={slab.SlabNumber} className="border-t border-gray-200 dark:border-gray-700">
                                        <td className="px-4 py-3">{slab.SlabNumber}</td>
                                        <td className="px-4 py-3">{slab.FromUnit}</td>
                                        <td className="px-4 py-3">{slab.ToUnit ?? 'And above'}</td>
                                        <td className="px-4 py-3">रु {slab.RatePerUnit}</td>
                                    </tr>
                                ))}
                                {slabs?.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center text-gray-500">
                                            No slab details found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewWaterRateSlab
