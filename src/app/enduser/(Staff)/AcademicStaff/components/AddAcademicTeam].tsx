'use client'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { IAcademicTeam } from '../types/IAcademicTeam'
import { useAddAcademicTeam } from '../hooks'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import {
  useGetAllProvince,
  useGetDistrictByProvince,
  useGetMunicipalityByDistrict,
  useGetVDCByDistrict,
} from '@/components/common/hooks'
import { useGetAllRoles } from '@/app/SuperAdmin/accessControl/roles/hooks'
type Props = {
  form: UseFormReturn<IAcademicTeam>
  onClose: () => void
}
const AddAcademicTeamForm = ({ form, onClose }: Props) => {
  const addAcademicTeam = useAddAcademicTeam()
  const { handleError, clearError } = useErrorHandler()
  const { data: allProvince } = useGetAllProvince()
  const [genderStatus, setGenderStatus] = useState<number | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [selectedProvinceId, setSelectedProvinceId] = useState<
    number | undefined
  >(0)
  const [selectedDistrictId, setSelectedDistrictId] = useState<
    number | undefined
  >(0)
  const [selectedVdcId, setSelectedVdcId] = useState<number | null>(null)
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<
    number | null
  >(null)
  const { data: allRoles } = useGetAllRoles()
  const { data: filteredDistrict } =
    useGetDistrictByProvince(selectedProvinceId)
  const { data: filteredVdc } = useGetVDCByDistrict(selectedDistrictId)
  const { data: filteredMunicipality } =
    useGetMunicipalityByDistrict(selectedDistrictId)

  const handleClose = () => {
    form.reset()
  }
  const onSubmit: SubmitHandler<IAcademicTeam> = async (data) => {
    clearError()
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('username', data.username)
    formData.append('password', data.password)
    formData.append('fullName', data.fullName)
    if (data.teacherImg) {
      formData.append('teacherImg', data.teacherImg as File)
    }
    formData.append('address', data.address)
    formData.append('provinceId', String(data.provinceId))
    formData.append('districtId', String(data.districtId))
    formData.append('vdcid', String(data.vdcid))
    formData.append('municipalityId', String(data.municipalityId))
    formData.append('wardNumber', String(data.wardNumber))
    formData.append('gender', String(data.gender))
    data.rolesId.forEach((role) => {
      formData.append('rolesId', role)
    })
    try {
      await toast.promise(addAcademicTeam.mutateAsync(formData), {
        loading: 'Adding AcademicTeam...',
        success: 'Successfully added AcademicTeam',
      })
      handleClose()
    } catch (error) {
      const errorMsg = handleError(error)
      Toast.error(errorMsg)
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [AcademicTeamImgPath, setAcademicTeamImgPath] = useState<string>('')
  const [image, setImage] = useState<File | ''>()
  const handleImageClick = () => fileInputRef.current?.click()
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAcademicTeamImgPath(URL.createObjectURL(file))
      setImage(file)
    }
  }
  useEffect(() => {
    if (selectedRoleId) {
      form.setValue('rolesId', [selectedRoleId], {
        shouldValidate: true,
      })
    }
    if (image) {
      form.setValue('teacherImg', image, {
        shouldValidate: true,
      })
    }
  }, [selectedRoleId, image])
  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
              Add AcademicTeam
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-3xl hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 border-b pb-2">
                Personal Details
              </h2>
              <div className="flex">
                <div className="flex flex-col items-center w-[20%]">
                  <div
                    onClick={handleImageClick}
                    className="w-28 h-28 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:ring-4 hover:ring-teal-500 transition-all"
                  >
                    {AcademicTeamImgPath ? (
                      <img
                        src={AcademicTeamImgPath}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Click to add
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[80%]">
                  <InputElement
                    label="Full Name"
                    form={form}
                    name="fullName"
                    placeholder="Enter Full Name"
                    required
                  />
                  <InputElement
                    label="User Name"
                    form={form}
                    name="username"
                    placeholder="Enter User Name"
                  />
                  <InputElement
                    label="Email"
                    form={form}
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                  />
                  <InputElement
                    label="Password"
                    form={form}
                    name="password"
                    type="Password"
                    placeholder="Enter Password"
                  />
                  <AppCombobox
                    label="Gender"
                    dropdownPositionClass="absolute"
                    name="gender"
                    value={genderStatus}
                    options={[
                      { id: 1, name: 'Male' },
                      { id: 2, name: 'Female' },
                      { id: 3, name: 'Other' },
                    ]}
                    dropDownWidth="w-full"
                    selected={
                      [
                        { id: 1, name: 'Male' },
                        { id: 2, name: 'Female' },
                        { id: 3, name: 'Other' },
                      ].find((g) => g.id === genderStatus) || null
                    }
                    onSelect={(option) => {
                      const value = option?.id ?? null
                      setGenderStatus(value)

                      if (value !== null) {
                        form.setValue('gender', value, {
                          shouldValidate: true,
                        })
                      }
                    }}
                    getLabel={(o) => o?.name || ''}
                    getValue={(o) => o?.id ?? ''}
                  />
                  <AppCombobox
                    value={selectedRoleId}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Role"
                    name="rolesId"
                    form={form}
                    options={allRoles?.Items}
                    selected={
                      allRoles?.Items?.find((g) => g?.Id === selectedRoleId) ||
                      null
                    }
                    onSelect={(group) => {
                      const id = group?.Id ?? null

                      setSelectedRoleId(id)
                      if (id) form.setValue('rolesId', [id])
                    }}
                    getLabel={(g) => g?.Name ?? ''}
                    getValue={(g) => g?.Id ?? ''}
                  />
                </div>
              </div>
            </section>
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 border-b pb-2">
                Address Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputElement
                  label="Address"
                  form={form}
                  name="address"
                  placeholder="Enter Address"
                />
                <AppCombobox
                  value={selectedProvinceId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Province"
                  name="provinceId"
                  form={form}
                  required
                  options={allProvince?.Items}
                  selected={
                    allProvince?.Items?.find(
                      (g) => g.Id === selectedProvinceId
                    ) || null
                  }
                  onSelect={(group) => setSelectedProvinceId(group?.Id ?? 0)}
                  getLabel={(g) => g?.provinceNameInEnglish ?? ''}
                  getValue={(g) => g?.Id ?? ''}
                />
                <AppCombobox
                  value={selectedDistrictId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="District"
                  name="districtId"
                  form={form}
                  required
                  options={filteredDistrict}
                  selected={
                    filteredDistrict?.find(
                      (g) => g.Id === selectedDistrictId
                    ) || null
                  }
                  onSelect={(group) => setSelectedDistrictId(group?.Id ?? 0)}
                  getLabel={(g) => g?.districtNameInEnglish ?? ''}
                  getValue={(g) => g?.Id ?? ''}
                />
                <AppCombobox
                  value={selectedMunicipalityId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  disabled={selectedVdcId !== 0 && selectedVdcId !== null}
                  label="Municipality"
                  name="municipalityId"
                  form={form}
                  options={filteredMunicipality}
                  selected={
                    filteredMunicipality?.find(
                      (g) => g.Id === selectedMunicipalityId
                    ) || null
                  }
                  onSelect={(group) =>
                    setSelectedMunicipalityId(group?.Id ?? null)
                  }
                  getLabel={(g) => g?.MunicipalityNameinEnglish ?? ''}
                  getValue={(g) => g?.Id ?? ''}
                />
                <AppCombobox
                  value={selectedVdcId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="VDC"
                  disabled={
                    selectedMunicipalityId !== 0 &&
                    selectedMunicipalityId !== null
                  }
                  name="vdcid"
                  form={form}
                  options={filteredVdc}
                  selected={
                    filteredVdc?.find((g) => g.Id === selectedVdcId) || null
                  }
                  onSelect={(group) => setSelectedVdcId(group?.Id ?? null)}
                  getLabel={(g) => g?.VdcNameInNepali ?? ''}
                  getValue={(g) => g?.Id ?? ''}
                />
                <InputElement
                  label="Ward Number"
                  form={form}
                  name="wardNumber"
                  inputType="number"
                  placeholder="Enter Ward Number"
                />
              </div>
            </section>
            <div className="flex justify-center mt-8">
              <ButtonElement
                type="submit"
                text="Submit"
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
              />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  )
}

export default AddAcademicTeamForm
