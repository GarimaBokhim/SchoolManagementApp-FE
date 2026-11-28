'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, Download, Edit, Filter, MoreVertical, Plus, Printer, ReceiptIndianRupeeIcon, RotateCcw, Trash, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { InputElement } from '@/components/Input/InputElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { useDeleteHouseHolds, useGetAllHouseHolds } from '../hooks'
import { HouseHoldsResponse } from '../types/IHouseHolds'
import AddHouseHolds from '../pages/Add'
import EditHouseHolds from '../pages/Edit'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import DeleteComponents from '@/components/DeleteComponent/DeleteComponents'
import { api } from '@/utils/instance'

interface FilterFormData {
    consumerName: string
    startDate: string
    endDate: string
}

//#region ActionMenu
interface ActionMenuProps {
    HouseHolds: HouseHoldsResponse;
    // onView: (Invoice: InvoiceResponse) => void;
    onEdit: (HouseHolds: HouseHoldsResponse) => void;
    onDelete: (id: string) => void;
}

const ActionMenu = ({
    HouseHolds,
    onEdit,
    onDelete,
}: ActionMenuProps) => {
    const [open, setOpen] = useState(false)
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
    const buttonRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    const calculatePosition = useCallback(() => {
        if (!buttonRef.current) return
        const rect = buttonRef.current.getBoundingClientRect()
        const menuHeight = 160
        const menuWidth = 180
        const spaceBelow = window.innerHeight - rect.bottom
        const openUpward = spaceBelow < menuHeight + 8
        setMenuStyle({
            position: 'fixed',
            right: window.innerWidth - rect.right,
            top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
            width: menuWidth,
            zIndex: 9999,
        })
    }, [])

    const toggle = () => {
        if (!open) calculatePosition()
        setOpen((prev) => !prev)
    }

    useEffect(() => {
        if (!open) return
        const handle = (e: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(e.target as Node)
            ) setOpen(false)
        }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [open])

    useEffect(() => {
        if (!open) return
        const update = () => calculatePosition()
        window.addEventListener('scroll', update, true)
        window.addEventListener('resize', update)
        return () => {
            window.removeEventListener('scroll', update, true)
            window.removeEventListener('resize', update)
        }
    }, [open, calculatePosition])



    return (
        <div className="flex justify-center">
            <button
                ref={buttonRef}
                onClick={toggle}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Actions"
            >
                <MoreVertical size={18} className="text-gray-600 dark:text-gray-300" />
            </button>

            {open && (
                <div
                    ref={menuRef}
                    style={menuStyle}
                    className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1"
                >
                    <button
                        onClick={() => { onEdit(HouseHolds); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Edit size={14} /> Edit
                    </button>
                    <button
                        onClick={() => { onDelete(HouseHolds.id); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Trash size={14} /> Delete
                    </button>

                    {/* {canEdit && (
                        <button
                            onClick={() => { onEdit(InstallmentInvoice); setOpen(false) }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <Edit size={14} /> Edit
                        </button>
                    )} */}
                    {/* 
                    <button
                        onClick={() => { onConvert(InstallmentInvoice); setOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <User size={14} /> Convert to Applicant
                    </button> */}

                    {/* {canDelete && (
                        <button
                            onClick={() => { onDelete(Invoice.id); setOpen(false) }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <Trash size={14} /> Delete
                        </button>
                    )} */}
                </div>
            )}
        </div>
    )
}




const resolveAssetUrl = (path?: string | null): string | null => {
    if (!path || path === '-' || path === 'string' || path.trim() === '') return null

    const assetProxyPrefix = '/api/assets/'
    const raw = path.trim()

    try {
        if (/^https?:\/\//i.test(raw)) {
            const parsed = new URL(raw)
            const pathname = parsed.pathname.replace(/^\/+/, '')

            if (!pathname) return null
            return `${assetProxyPrefix}${pathname}${parsed.search}`
        }
    } catch {
        // fall through to relative-path handling below
    }

    const cleanPath = raw.replace(/^\/+/, '')
    if (!cleanPath) return null
    return `${assetProxyPrefix}${cleanPath}`
}

const getHouseholdAddress = (household: HouseHoldsResponse) =>
    [household.tole, household.wardNumber || household.wardnumber
        ? `Ward ${household.wardNumber || household.wardnumber}`
        : null].filter(Boolean).join(', ') || '-'

interface QrOrganizationDetails {
    name: string
    address?: string
    contactNumber?: string
    imageUrl?: string
}

const createHouseholdQrLabel = async (
    household: HouseHoldsResponse,
    organization: QrOrganizationDetails,
) => {
    const qrUrl = resolveAssetUrl(household.qrCode)
    if (!qrUrl) {
        throw new Error('QR code image is not available.')
    }

    const response = await fetch(qrUrl)
    if (!response.ok) throw new Error(`QR download failed with status ${response.status}`)

    const imageBlob = await response.blob()
    if (!imageBlob.type.startsWith('image/')) throw new Error('QR download did not return an image.')

    const imageUrl = URL.createObjectURL(imageBlob)
    let logoUrl: string | null = null
    try {
        const qrImage = new Image()
        await new Promise<void>((resolve, reject) => {
            qrImage.onload = () => resolve()
            qrImage.onerror = () => reject(new Error('Could not load the QR code image.'))
            qrImage.src = imageUrl
        })

        let logoImage: HTMLImageElement | null = null
        const resolvedLogoUrl = resolveAssetUrl(organization.imageUrl)
        if (resolvedLogoUrl) {
            try {
                const logoResponse = await fetch(resolvedLogoUrl)
                if (!logoResponse.ok) throw new Error(`Logo download failed with status ${logoResponse.status}`)
                const logoBlob = await logoResponse.blob()
                if (!logoBlob.type.startsWith('image/')) throw new Error('School logo response was not an image.')

                const loadedLogoUrl = URL.createObjectURL(logoBlob)
                logoUrl = loadedLogoUrl
                logoImage = new Image()
                await new Promise<void>((resolve, reject) => {
                    if (!logoImage) return reject(new Error('Could not load the school logo.'))
                    logoImage.onload = () => resolve()
                    logoImage.onerror = () => reject(new Error('Could not load the school logo.'))
                    logoImage.src = loadedLogoUrl
                })
            } catch (error) {
                console.error('Unable to load school logo for QR label:', error)
            }
        }

        const measurementCanvas = document.createElement('canvas')
        const measurementContext = measurementCanvas.getContext('2d')
        if (!measurementContext) throw new Error('Could not measure QR label text.')

        const wrapText = (text: string, font: string, maxWidth: number) => {
            measurementContext.font = font
            const lines: string[] = []
            let currentLine = ''

            for (const word of (text || '-').split(/\s+/)) {
                if (!word) continue
                const candidate = currentLine ? `${currentLine} ${word}` : word
                if (measurementContext.measureText(candidate).width <= maxWidth) {
                    currentLine = candidate
                    continue
                }

                if (currentLine) {
                    lines.push(currentLine)
                    currentLine = ''
                }

                let part = ''
                for (const character of word) {
                    if (part && measurementContext.measureText(part + character).width > maxWidth) {
                        lines.push(part)
                        part = character
                    } else {
                        part += character
                    }
                }
                currentLine = part
            }

            if (currentLine) lines.push(currentLine)
            return lines.length ? lines : ['-']
        }

        const nameLines = wrapText(household.consumerName, 'bold 27px Arial', 230)
        const meterLines = wrapText(household.meterNumber, 'bold 24px Arial', 330)
        const addressLines = wrapText(getHouseholdAddress(household), 'bold 25px Arial', 230)
        const detailsLineCount = Math.max(nameLines.length, meterLines.length, addressLines.length)
        const detailsExtraHeight = Math.max(0, detailsLineCount - 1) * 32

        const canvas = document.createElement('canvas')
        canvas.width = 960
        canvas.height = 1200 + detailsExtraHeight
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Could not render the QR code label.')

        const navy = '#082f70'
        const blue = '#0753a5'
        const lightBlue = '#c9e8ff'
        const roundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
            context.beginPath()
            context.roundRect(x, y, width, height, radius)
        }

        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        roundedRect(16, 16, 928, 1168, 42)
        context.strokeStyle = navy
        context.lineWidth = 5
        context.stroke()

        if (logoImage) {
            const logoSize = 182
            const scale = Math.min(logoSize / logoImage.width, logoSize / logoImage.height)
            const width = logoImage.width * scale
            const height = logoImage.height * scale
            context.save()
            context.beginPath()
            context.arc(136, 115, 91, 0, Math.PI * 2)
            context.clip()
            context.drawImage(logoImage, 136 - width / 2, 115 - height / 2, width, height)
            context.restore()
            context.beginPath()
            context.arc(136, 115, 91, 0, Math.PI * 2)
            context.strokeStyle = navy
            context.lineWidth = 4
            context.stroke()
        }

        context.beginPath()
        context.moveTo(276, 52)
        context.lineTo(276, 209)
        context.strokeStyle = navy
        context.lineWidth = 3
        context.stroke()

        const title = organization.name || 'Jalakanya Khaneypani Upabhokta Samuha'
        context.fillStyle = navy
        context.textAlign = 'center'
        context.font = 'bold 46px Arial'
        const titleParts = title.length > 23
            ? [title.slice(0, title.lastIndexOf(' ', Math.ceil(title.length / 2))), title.slice(title.lastIndexOf(' ', Math.ceil(title.length / 2)) + 1)]
            : [title]
        titleParts.forEach((line, index) => context.fillText(line, 606, 102 + index * 54, 630))

        context.font = 'bold 25px Arial'
        context.textAlign = 'left'
        context.fillText(organization.address || '', 354, 220, 280)
        context.fillText(organization.contactNumber || '', 744, 220, 170)

        context.fillStyle = navy
        context.beginPath()
        context.arc(325, 210, 12, 0, Math.PI * 2)
        context.fill()
        context.beginPath()
        context.moveTo(313, 210)
        context.lineTo(325, 232)
        context.lineTo(337, 210)
        context.fill()
        context.beginPath()
        context.arc(325, 208, 4, 0, Math.PI * 2)
        context.fillStyle = '#ffffff'
        context.fill()

        context.beginPath()
        context.moveTo(650, 190)
        context.lineTo(650, 228)
        context.strokeStyle = navy
        context.lineWidth = 3
        context.stroke()

        context.fillStyle = navy
        context.beginPath()
        context.moveTo(686, 200)
        context.lineTo(689, 198)
        context.quadraticCurveTo(691, 197, 692, 199)
        context.lineTo(695, 203)
        context.quadraticCurveTo(696, 205, 694, 206)
        context.lineTo(692, 208)
        context.quadraticCurveTo(696, 214, 701, 217)
        context.lineTo(703, 215)
        context.quadraticCurveTo(704, 213, 706, 215)
        context.lineTo(709, 218)
        context.quadraticCurveTo(711, 220, 709, 222)
        context.lineTo(707, 224)
        context.quadraticCurveTo(705, 226, 702, 225)
        context.quadraticCurveTo(692, 221, 686, 213)
        context.quadraticCurveTo(683, 206, 686, 200)
        context.fill()

        context.beginPath()
        context.moveTo(48, 250)
        context.lineTo(912, 250)
        context.strokeStyle = navy
        context.lineWidth = 3
        context.stroke()

        const qrFrameSize = 504
        const qrFrameX = (canvas.width - qrFrameSize) / 2
        const qrFrameY = 272
        roundedRect(qrFrameX, qrFrameY, qrFrameSize, qrFrameSize, 30)
        context.fillStyle = '#ffffff'
        context.fill()
        context.strokeStyle = blue
        context.lineWidth = 6
        context.stroke()

        const qrSize = 466
        const qrScale = Math.min(qrSize / qrImage.width, qrSize / qrImage.height)
        const qrWidth = qrImage.width * qrScale
        const qrHeight = qrImage.height * qrScale
        const qrX = (canvas.width - qrWidth) / 2
        const qrY = qrFrameY + (qrFrameSize - qrHeight) / 2
        context.drawImage(qrImage, qrX, qrY, qrWidth, qrHeight)

        roundedRect(170, 793, 620, 124, 64)
        context.fillStyle = navy
        context.fill()
        context.strokeStyle = blue
        context.lineWidth = 2
        context.stroke()
        context.strokeStyle = '#ffffff'
        context.lineWidth = 4
        context.beginPath()
        context.moveTo(380, 812)
        context.lineTo(380, 899)
        context.stroke()

        context.strokeStyle = '#ffffff'
        context.lineWidth = 5
        roundedRect(235, 810, 48, 88, 8)
        context.stroke()
        context.beginPath()
        context.arc(259, 854, 12, 0, Math.PI * 2)
        context.stroke()
        context.beginPath()
        context.arc(259, 890, 2, 0, Math.PI * 2)
        context.fillStyle = '#ffffff'
        context.fill()
        context.fillStyle = '#ffffff'
        context.textAlign = 'left'
        context.font = 'bold italic 37px Arial'
        context.fillStyle = '#ffffff'
        context.fillText('Scan to Set', 425, 846)
        context.font = 'bold italic 46px Arial'
        context.fillStyle = '#ffdb00'
        context.fillText('Water Bill', 425, 897)

        context.strokeStyle = blue
        context.lineWidth = 7
        context.lineCap = 'round'
        context.beginPath()
        context.moveTo(113, 828)
        context.lineTo(96, 814)
        context.moveTo(103, 855)
        context.lineTo(79, 852)
        context.moveTo(112, 881)
        context.lineTo(94, 895)
        context.moveTo(847, 828)
        context.lineTo(864, 814)
        context.moveTo(857, 855)
        context.lineTo(881, 852)
        context.moveTo(848, 881)
        context.lineTo(866, 895)
        context.stroke()

        context.fillStyle = lightBlue
        roundedRect(34, 934, 892, 160 + detailsExtraHeight, 30)
        context.fill()

        const columnCenters = [170, 480, 790]
        context.strokeStyle = navy
        context.lineWidth = 3
        context.beginPath()
        context.moveTo(292, 948)
        context.lineTo(292, 1080 + detailsExtraHeight)
        context.moveTo(668, 948)
        context.lineTo(668, 1080 + detailsExtraHeight)
        context.stroke()

        context.fillStyle = navy
        context.beginPath()
        context.arc(columnCenters[0], 970, 11, 0, Math.PI * 2)
        context.fill()
        context.beginPath()
        context.ellipse(columnCenters[0], 995, 19, 12, 0, Math.PI, 0)
        context.fill()

        context.strokeStyle = navy
        context.lineWidth = 4
        context.beginPath()
        context.arc(columnCenters[1], 980, 25, Math.PI, Math.PI * 2)
        context.stroke()
        context.beginPath()
        context.moveTo(columnCenters[1], 980)
        context.lineTo(columnCenters[1] + 14, 963)
        context.moveTo(columnCenters[1] - 18, 974)
        context.lineTo(columnCenters[1] - 23, 971)
        context.moveTo(columnCenters[1] + 18, 974)
        context.lineTo(columnCenters[1] + 23, 971)
        context.stroke()

        context.beginPath()
        context.moveTo(columnCenters[2] - 25, 980)
        context.lineTo(columnCenters[2], 956)
        context.lineTo(columnCenters[2] + 25, 980)
        context.moveTo(columnCenters[2] - 18, 981)
        context.lineTo(columnCenters[2] - 18, 1000)
        context.lineTo(columnCenters[2] + 18, 1000)
        context.lineTo(columnCenters[2] + 18, 981)
        context.moveTo(columnCenters[2] - 7, 1000)
        context.lineTo(columnCenters[2] - 7, 986)
        context.lineTo(columnCenters[2] + 7, 986)
        context.lineTo(columnCenters[2] + 7, 1000)
        context.stroke()

        const drawDetailText = (
            x: number,
            label: string,
            lines: string[],
            valueFont: string,
            maxWidth: number,
        ) => {
            context.textAlign = 'center'
            context.fillStyle = navy
            context.font = 'bold 25px Arial'
            context.fillText(label, x, 1030, maxWidth)
            context.font = valueFont
            lines.forEach((line, index) => {
                context.fillText(line, x, 1070 + index * 32, maxWidth)
            })
        }
        drawDetailText(columnCenters[0], 'Name', nameLines, 'bold 27px Arial', 230)
        drawDetailText(columnCenters[1], 'Meter Number', meterLines, 'bold 24px Arial', 330)
        drawDetailText(columnCenters[2], 'Address', addressLines, 'bold 25px Arial', 230)

        context.save()
        context.translate(0, detailsExtraHeight)
        context.fillStyle = '#57c6f5'
        context.beginPath()
        context.moveTo(18, 1120)
        context.bezierCurveTo(170, 1070, 260, 1157, 420, 1117)
        context.bezierCurveTo(610, 1070, 740, 1168, 942, 1110)
        context.lineTo(942, 1184)
        context.lineTo(18, 1184)
        context.closePath()
        context.fill()

        context.fillStyle = '#0784d9'
        context.beginPath()
        context.moveTo(18, 1140)
        context.bezierCurveTo(170, 1094, 260, 1170, 420, 1138)
        context.bezierCurveTo(610, 1097, 740, 1178, 942, 1132)
        context.lineTo(942, 1184)
        context.lineTo(18, 1184)
        context.closePath()
        context.fill()

        context.fillStyle = '#064995'
        context.beginPath()
        context.moveTo(18, 1160)
        context.bezierCurveTo(170, 1120, 260, 1181, 420, 1157)
        context.bezierCurveTo(610, 1123, 740, 1185, 942, 1150)
        context.lineTo(942, 1184)
        context.lineTo(18, 1184)
        context.closePath()
        context.fill()
        context.restore()

        roundedRect(16, 16, 928, canvas.height - 32, 42)
        context.strokeStyle = navy
        context.lineWidth = 5
        context.stroke()

        return canvas.toDataURL('image/png')
    } finally {
        URL.revokeObjectURL(imageUrl)
        if (logoUrl) URL.revokeObjectURL(logoUrl)
    }
}

const downloadHouseholdQrCode = async (household: HouseHoldsResponse, organization: QrOrganizationDetails) => {
    try {
        const label = await createHouseholdQrLabel(household, organization)
        const link = document.createElement('a')
        link.href = label
        link.download = `${household.consumerName || 'consumer'}-${household.meterNumber || 'qr'}.png`
            .replace(/[<>:"/\\|?*\x00-\x1f]/g, '-')
            .replace(/\s+/g, '-')
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (error) {
        console.error('Unable to download QR code label:', error)
        toast.error('Could not download the QR code label. Please try again.')
    }
}

const printHouseholdQrCode = async (
    household: HouseHoldsResponse,
    organization: QrOrganizationDetails,
) => {
    const printWindow = window.open('', '_blank', 'width=560,height=760')
    if (!printWindow) {
        toast.error('Allow pop-ups to print the QR code.')
        return
    }

    try {
        const label = await createHouseholdQrLabel(household, organization)
        const printDocument = printWindow.document
        printDocument.title = `Consumer QR - ${household.meterNumber}`
        printDocument.head.innerHTML = '<meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;font-family:Arial,sans-serif}img{display:block;width:min(100%,500px);height:auto}@media print{body{min-height:0;padding:0}img{width:100%;max-width:500px}}</style>'
        printDocument.body.innerHTML = ''

        const image = printDocument.createElement('img')
        image.alt = `Consumer QR label for ${household.consumerName}`
        image.onload = () => {
            printWindow.focus()
            printWindow.print()
        }
        image.onerror = () => {
            printWindow.close()
            toast.error('Could not load the QR code label for printing.')
        }
        image.src = label
        printDocument.body.appendChild(image)
        printWindow.addEventListener('afterprint', () => printWindow.close(), { once: true })
    } catch (error) {
        console.error('Unable to prepare QR code label for printing:', error)
        printWindow.close()
        toast.error('Could not prepare the QR code label for printing.')
    }
}

const AllHouseHoldsForm = () => {
    const { menuStatus } = usePermissions()
    const { handleError, clearError } = useErrorHandler()
    const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)
    const [selectedQrHousehold, setSelectedQrHousehold] = useState<HouseHoldsResponse | null>(null)
    const [qrLabelPreview, setQrLabelPreview] = useState<string | null>(null)
    const {
        data: qrOrganization,
        error: qrOrganizationError,
        isLoading: isQrOrganizationLoading,
    } = useQuery({
        queryKey: ['qr-organization', selectedQrHousehold?.schoolId],
        queryFn: async () => {
            const schoolId = selectedQrHousehold?.schoolId
            if (!schoolId) throw new Error('Household does not include a school ID.')
            const response = await api.get<QrOrganizationDetails>(`/api/SetupControllers/School/${schoolId}`)
            return response.data
        },
        staleTime: 5 * 60 * 1000,
        retry: false,
        enabled: Boolean(selectedQrHousehold?.schoolId),
    })

    useEffect(() => {
        if (qrOrganizationError && selectedQrHousehold?.schoolId) {
            console.error('Unable to load QR organization details:', qrOrganizationError)
            toast.error('Could not load organization address and phone for the QR label.')
        }
    }, [qrOrganizationError, selectedQrHousehold?.schoolId])

    useEffect(() => {
        let cancelled = false
        setQrLabelPreview(null)

        if (!selectedQrHousehold || !qrOrganization) return

        createHouseholdQrLabel(selectedQrHousehold, qrOrganization)
            .then((label) => {
                if (!cancelled) setQrLabelPreview(label)
            })
            .catch((error: unknown) => {
                console.error('Unable to render QR label preview:', error)
                if (!cancelled) toast.error('Could not render the QR label preview.')
            })

        return () => {
            cancelled = true
        }
    }, [selectedQrHousehold, qrOrganization])

    const [openFilter, setOpenFilter] = useState(false)
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedHousehold, setSelectedHousehold] = useState<HouseHoldsResponse | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const [paginationParams, setPaginationParams] = useState({
        pageSize: 10,
        pageIndex: 1,
        isPagination: true,
    })

    type SearchParam = {
        pageSize: number
        pageIndex: number
        isPagination: boolean
    }
    const handlePageChange = (params: SearchParam) => {
        params.pageSize = paginationParams.pageSize
        setPaginationParams(params)
    }

    const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`
    const [params, setParams] = useState('')
    const fullQuery = query + (params || '')

    const formRef = useRef<DateRangeFilterRef>(null)


    const form = useForm<FilterFormData>({
        defaultValues: { consumerName: '', startDate: '', endDate: '' },
    })

    const { data, isLoading, error } = useGetAllHouseHolds(fullQuery)
    const deleteHouseHolds = useDeleteHouseHolds()


    const HouseHoldsDetails = data?.Items ?? [];

    const onFilterSubmit = (formData: FilterFormData) => {
        clearError()
        const consumerName = formData.consumerName.trim()
        const queryParams = [
            consumerName
                ? `consumerName=${encodeURIComponent(consumerName)}`
                : null,
            formData.startDate
                ? `startDate=${encodeURIComponent(formData.startDate)}`
                : null,
            formData.endDate
                ? `endDate=${encodeURIComponent(formData.endDate)}`
                : null,
        ]
            .filter(Boolean)
            .join('&')
        const fullQuery = queryParams ? `&${queryParams}` : ''
        setPaginationParams((current) => ({ ...current, pageIndex: 1 }))
        setParams(fullQuery)
    }


    const HouseHoldsType = [
        { id: 1, name: 'Application' },
        { id: 2, name: 'Documents' }

    ];


    const handleEditLead = (HouseHolds: HouseHoldsResponse) => {
        setSelectedHousehold(HouseHolds)
        setEditModal(true)
    }

    const handleAddHouseHolds = () => {
        setSelectedHousehold(null)
        setAddModal(true)
    };

    const handleDelete = async (id: string) => {
        try {
            console.error("Id", id)
            await deleteHouseHolds.mutateAsync(id)
        } catch (error) {
            console.error(error)
        }
    }


    const handleAddSubmit = () => {
        setAddModal(false);
    };

    if (error) {
        return (
            <div className="p-4 sm:p-6">
                <Toaster position="top-right" />
                <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
                    <div className="text-center py-16">
                        <BookOpen size={64} className="mx-auto text-red-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            Error loading House Holds
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">Please try again later.</p>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6">
                <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
                    </div>
                </div>
            </div>
        )
    }

    const onClearClick = () => {
        setParams("");
        formRef.current?.handleClear();
        form.reset();
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="p-4 sm:p-6">
                <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

                    {/* Header */}
                    <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
                        <h1 className="text-xl font-semibold dark:text-white">All HouseHolds</h1>
                        <div className="flex items-center space-x-3">
                            <ButtonElement
                                type="button"
                                text="Filter"
                                icon={<Filter size={14} />}
                                onClick={() => setOpenFilter(!openFilter)}
                                className="!bg-emerald-600 hover:!bg-emerald-700"
                            />
                            <ButtonElement
                                icon={<Plus size={18} />}
                                type="button"
                                text="Add HouseHolds"
                                onClick={handleAddHouseHolds}
                                className="!font-semibold"
                            />



                            {/* {canAdd && (
                                <ButtonElement
                                    icon={<Plus size={18} />}
                                    type="button"
                                    text="Add New Installments"
                                    onClick={() => setAddModal(true)}
                                    className="!font-semibold"
                                />
                            )} */}
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {openFilter && (
                        <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <form
                                onSubmit={form.handleSubmit(onFilterSubmit)}
                                className="flex flex-wrap items-end gap-4 md:gap-6"
                            >
                                <DateRangeFilter
                                    ref={formRef}
                                    form={form}
                                    onSubmit={onFilterSubmit}
                                    setParams={setParams}
                                    startDateKey="startDate"
                                    endDateKey="endDate"
                                />

                                <div className="flex-1 min-w-[240px]">
                                    <InputElement
                                        label="Consumer Name"
                                        form={form}
                                        name="consumerName"
                                        placeholder="Enter Consumer Name"
                                    />
                                </div>

                                <div className="flex gap-2 mt-2 sm:mt-0 lg:ml-auto">
                                    <ButtonElement
                                        type="submit"
                                        text="Filter"
                                        icon={<Filter size={14} />}
                                        className="!bg-emerald-600 hover:!bg-emerald-700"
                                    />
                                    <ButtonElement
                                        type="button"
                                        text="Clear"
                                        icon={<RotateCcw size={14} />}
                                        onClick={onClearClick}
                                        className="!bg-gray-500 hover:!bg-gray-600"
                                    />
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="px-4 pb-4">
                        <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                                        <th className="px-4 py-3 text-left">S.N</th>
                                        <th className="px-4 py-3 text-left">ConsumerName</th>
                                        <th className="px-4 py-3 text-left">MeterNumber</th>
                                        <th className="px-4 py-3 text-left">FamilyMember</th>
                                        <th className="px-4 py-3 text-left">Email</th>
                                        <th className="px-4 py-3 text-left">Tole</th>
                                        <th className="px-4 py-3 text-left">Water Tariff Plan</th>
                                        <th className="px-4 py-3 text-left">Water Rate Slab</th>
                                        <th className="px-4 py-3 text-left">QrCode</th>

                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {HouseHoldsDetails.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="p-4 text-center italic text-gray-500 dark:text-gray-400">
                                                No visa HouseHolds found.
                                            </td>
                                        </tr>
                                    ) : (
                                        HouseHoldsDetails.map((HouseHolds, index) => (
                                            <tr
                                                key={HouseHolds.id}
                                                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                                            >
                                                <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {HouseHolds.consumerName}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {HouseHolds.meterNumber}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {HouseHolds.familyMember ?? '-'}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {HouseHolds.email}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {HouseHolds.tole}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {HouseHolds.waterTariffPlanName || '-'}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {HouseHolds.waterRateSlabName || '-'}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md flex-shrink-0 cursor-pointer">
                                                        {HouseHolds?.qrCode ? (() => {
                                                            const qrUrl = resolveAssetUrl(HouseHolds.qrCode);



                                                            if (!qrUrl) {
                                                                return (
                                                                    <span className="text-sm font-bold text-gray-700">
                                                                        No QR Code
                                                                    </span>
                                                                )
                                                            }

                                                            return (
                                                                <img
                                                                    src={qrUrl}
                                                                    alt="QR Code"
                                                                    className="w-full h-full object-contain hover:scale-110 transition-transform duration-200"
                                                                    onClick={() => setSelectedQrHousehold(HouseHolds)}
                                                                    onError={(e) => {
                                                                        console.log('QR Image failed:', e.currentTarget.src)
                                                                    }}
                                                                />
                                                            )
                                                        })() : (
                                                            <span className="text-sm font-bold text-gray-700">
                                                                No QR Code
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>


                                                <td className="py-1 px-4">
                                                    <ActionMenu
                                                        HouseHolds={HouseHolds}
                                                        onEdit={handleEditLead}
                                                        onDelete={setDeleteId}
                                                    />
                                                </td>


                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}

                {data && data?.Items?.length > 0 && (
                    <div className="mt-4">
                        <Pagination
                            form={form}
                            pagination={{
                                currentPage: data?.PageIndex ?? 1,
                                firstPage: data?.FirstPage ?? 1,
                                lastPage: data?.LastPage ?? 1,
                                nextPage: data?.NextPage ?? 1,
                                previousPage: data?.PreviousPage ?? 1,
                            }}
                            handleSearch={handlePageChange}
                        />
                    </div>
                )}

            </div>

            {selectedQrHousehold && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedQrHousehold(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Consumer QR label preview"
                        className="relative my-auto w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedQrHousehold(null)}
                            aria-label="Close QR code preview"
                            className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-slate-600 shadow transition hover:bg-white hover:text-slate-900"
                        >
                            <X size={20} />
                        </button>
                        {qrLabelPreview ? (
                            <img
                                src={qrLabelPreview}
                                alt={`QR label for ${selectedQrHousehold.consumerName}`}
                                className="block h-auto w-full"
                            />
                        ) : (
                            <div className="flex aspect-[4/5] items-center justify-center text-sm text-slate-500">
                                {isQrOrganizationLoading ? 'Loading organization details…' : 'Preparing QR label…'}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-3 p-4">
                            <button
                                type="button"
                                disabled={isQrOrganizationLoading || !qrOrganization}
                                onClick={() => qrOrganization && void downloadHouseholdQrCode(selectedQrHousehold, qrOrganization)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Download size={17} />
                                Download
                            </button>
                            <button
                                type="button"
                                disabled={isQrOrganizationLoading || !qrOrganization}
                                onClick={() => qrOrganization && void printHouseholdQrCode(selectedQrHousehold, qrOrganization)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Printer size={17} />
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            )}





            <AddHouseHolds
                visible={addModal}
                onClose={() => {
                    handleAddSubmit()
                }}
            />
            <EditHouseHolds
                visible={editModal}
                household={selectedHousehold}
                onClose={() => {
                    setEditModal(false)
                    setSelectedHousehold(null)
                }}
            />
            <DeleteComponents
                visible={Boolean(deleteId)}
                id={deleteId ?? ''}
                title="Delete household"
                description="Are you sure you want to delete this household? This action cannot be undone."
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
            />
        </>
    )
}

export default AllHouseHoldsForm