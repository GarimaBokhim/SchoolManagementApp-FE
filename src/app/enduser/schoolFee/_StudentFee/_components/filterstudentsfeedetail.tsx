/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { Filter, Printer, RotateCcw } from 'lucide-react'

import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { InputElement } from '@/components/Input/InputElement'
import useErrorHandler from '@/components/helpers/ErrorHandling'

import {
  IFilterStudentFee,
  IPaymentRecord,
  Istudentfeesummary,
} from '../types/IStudentFee'
import { useGetStudentFeesummary } from '../hooks'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useGetStudentByClass } from '@/app/enduser/(StudentManagement)/Student/hooks'
import {
  useGetAllClass,
  useGetClassById,
} from '@/app/enduser/(Academics)/Class/hooks'
import PaymentReceiptPrint from './printpaymentrecordindividually'
import { useReactToPrint } from 'react-to-print'

interface ViewStudentFeeFormProps {
  studentId?: string
  classId?: string
}

const ViewStudentFeeForm = ({
  studentId,
  classId,
}: ViewStudentFeeFormProps) => {
  const { handleError, clearError } = useErrorHandler()

  const { data: allClasses } = useGetAllClass()
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('')
  const { data: allStudents } = useGetStudentByClass(selectedClassId)
  const { data: allclasses } = useGetAllClass()
  const [params, setParams] = useState('')
  const componentRef = useRef<HTMLDivElement>(null)
  const [printData, setPrintData] = useState<IPaymentRecord | null>(null)

  const form = useForm<IFilterStudentFee>({
    defaultValues: {
      studentId: '',
      startDate: '',
      endDate: '',
    },
  })

  const handlePrintComponent = useReactToPrint({
    contentRef: componentRef,
  })

  const { setValue } = form

  const {
    data: filteredStudentFee,
    refetch,
    isLoading,
  } = useGetStudentFeesummary(params)

  useEffect(() => {
    if (!studentId || !classId) return

    queueMicrotask(() => {
      setSelectedStudentId(studentId)
      setValue('studentId', studentId)
      const query = `?studentId=${encodeURIComponent(studentId)}&classId=${encodeURIComponent(classId)}`
      setParams(query)
    })

    refetch()
  }, [studentId, classId])

  const onSubmit: SubmitHandler<IFilterStudentFee> = async (formData) => {
    clearError()
    try {
      const queryParams = [
        formData.studentId && `studentId=${formData.studentId}`,
        formData.startDate && `startDate=${formData.startDate}`,
        formData.endDate && `endDate=${formData.endDate}`,
        classId && `classId=${classId}`,
      ]
        .filter(Boolean)
        .join('&')

      const fullQuery = queryParams ? `?${queryParams}` : ''

      await toast.promise(
        (async () => {
          setParams(fullQuery)
          await refetch()
        })(),
        {
          loading: 'Fetching data...',
          success: 'Data fetched successfully!',
        }
      )
    } catch (error) {
      toast.error(handleError(error))
    }
  }

  const onClear = () => {
    form.reset()
    setSelectedStudentId('')
    if (classId) {
      setParams(`?classId=${encodeURIComponent(classId)}`)
    } else {
      setParams('')
    }
    refetch()
  }

  const getPaymentMethodLabel = (value: number) => {
    switch (value) {
      case 0: return 'Cash'
      case 1: return 'Credit Card'
      case 2: return 'Debit Card'
      case 3: return 'Bank Transfer'
      case 4: return 'Mobile Payment'
      case 5: return 'Cheque'
      default: return 'Unknown'
    }
  }

  const handlePrint = (fee: Istudentfeesummary) => {
    const data: IPaymentRecord = {
      studentid: studentId ?? '',        // student id and class id is coming from props 
      classid: classId ?? fee.classId,   
      amountPaid: fee.paidAmount,
      paymentDate: fee.paymentDate || new Date().toISOString(),
      paymentMethod: fee.paymentMethod,
      reference: fee.reference || '-',
    }

    setPrintData(data)

    setTimeout(() => {
      handlePrintComponent?.()
    }, 100)
  }

  return (
    <>
      <Toaster position="top-right" />

      {/* FILTER FORM */}
      <div className="bg-white p-5 rounded-xl border shadow-sm mb-4 flex justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start gap-3 w-full max-w-[900px] flex-wrap sm:flex-nowrap"
        >
          <div className="flex-none w-[250px]">
            <AppCombobox
              value={selectedStudentId}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              label="Student Name"
              name="studentId"
              form={form}
              options={allStudents?.Items ?? []}
              selected={
                allStudents?.Items?.find((s) => s.id === selectedStudentId) ??
                null
              }
              onSelect={(student) => {
                const id = student?.id ?? ''
                setSelectedStudentId(id)
                form.setValue('studentId', id)
                const query = id
                  ? `?studentId=${encodeURIComponent(id)}&classId=${encodeURIComponent(classId || '')}`
                  : classId
                    ? `?classId=${encodeURIComponent(classId)}`
                    : ''
                setParams(query)
                refetch()
              }}
              getLabel={(s) =>
                s
                  ? [s.firstName, s.middleName, s.lastName]
                      .filter(Boolean)
                      .join(' ')
                  : '-'
              }
              getValue={(s) => s?.id ?? ''}
              className="h-[42px]"
            />
          </div>

          <div className="flex-none w-[250px]">
            <AppCombobox
              value={selectedClassId}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              label="Class"
              name="classId"
              form={form}
              options={allclasses?.Items ?? []}
              selected={
                allclasses?.Items?.find((s) => s.id === selectedClassId) ?? null
              }
              onSelect={(cls) => {
                const id = cls?.id ?? ''
                setSelectedClassId(id)
                form.setValue('classId', id)
                const query = id
                  ? `?studentId=${encodeURIComponent(selectedStudentId)}&classId=${encodeURIComponent(id)}`
                  : selectedStudentId
                    ? `?studentId=${encodeURIComponent(selectedStudentId)}`
                    : ''
                setParams(query)
                refetch()
              }}
              getLabel={(s) => (s ? `${s.name}` : '-')}
              getValue={(s) => s?.id ?? ''}
              className="h-[42px]"
            />
          </div>

          <div className="flex-none w-[170px]">
            <InputElement
              label="Start Date"
              inputType="date"
              name="startDate"
              form={form}
              className="w-full h-[42px]"
            />
          </div>

          <div className="flex-none w-[170px]">
            <InputElement
              label="End Date"
              inputType="date"
              name="endDate"
              form={form}
              className="w-full h-[42px]"
            />
          </div>

          <div className="flex-none">
            <ButtonElement
              type="submit"
              text="Filter"
              icon={<Filter size={14} />}
              className="h-[42px] px-6 !bg-emerald-600 hover:!bg-emerald-700"
            />
          </div>

          <div className="flex-none">
            <ButtonElement
              type="button"
              text="Clear"
              icon={<RotateCcw size={14} />}
              onClick={onClear}
              className="h-[42px] px-6 !bg-gray-600 hover:!bg-gray-700"
            />
          </div>
        </form>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">S.N</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Paid Amount</th>
              <th className="px-4 py-3">Payment Method</th>
              <th className="px-4 py-3">Total Amount</th>
              <th className="px-4 py-3">Due Amount</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredStudentFee?.Items?.length ? (
              filteredStudentFee.Items.map(
                (fee: Istudentfeesummary, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      {allClasses?.Items?.find((c) => c.id === fee.classId)?.name ?? '-'}
                    </td>
                    <td className="px-4 py-3">{fee.paidAmount}</td>
                    <td className="px-4 py-3">
                      {getPaymentMethodLabel(fee.paymentMethod)}
                    </td>
                    <td className="px-4 py-3">{fee.totalAmount}</td>
                    <td className="px-4 py-3">{fee.dueAmount}</td>
                    <td className="px-4 py-3">
                      <ButtonElement
                        text=""
                        icon={<Printer size={14} />}
                        onClick={() => handlePrint(fee)}
                      />
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {printData && (
        <div style={{ display: 'none' }}>
          <div ref={componentRef}>
            <PaymentReceiptPrint data={printData} />
          </div>
        </div>
      )}
    </>
  )
}

export default ViewStudentFeeForm