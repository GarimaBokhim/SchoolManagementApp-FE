'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import {
    AddInquiryPayload,
    InquiryResponse,
    UpdateInquiryPayload,
} from '../types/IVisitors'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import {
    useAddInquiry,
    useGetAllCountry,
    useGetCourseByUniversity,
    useGetUniversityByCountry,
    useUpdateInquiry,
} from '../hooks'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useQueries } from '@tanstack/react-query'

type Props = {
    form: UseFormReturn<AddInquiryPayload>
    onClose: () => void
    inquiry?: InquiryResponse
    inquiryId?: string
}

type CountrySelection = {
    country: any
    universities: any[]
    coursesMap: Record<string, any[]>
}

const AddInquiryForm = ({
    form,
    onClose,
    inquiry,
    inquiryId,
}: Props) => {
    const addInquiry = useAddInquiry()
    const updateInquiry = useUpdateInquiry()

    const { handleError, clearError } = useErrorHandler()

    const gender = form.watch('gender')
    const educationLevel = form.watch('educationLevel')
    const englishProficiency = form.watch('englishProficiency')

    const [countrySelections, setCountrySelections] = useState<
        CountrySelection[]
    >([])

    const [selectedCountries, setSelectedCountries] = useState<string[]>([])

    const { data: countries = [] } = useGetAllCountry()

    const initializedInquiryId = useRef<string | null>(null)

    // ============================================================
    // GET UNIVERSITIES FOR SELECTED COUNTRIES
    // ============================================================

    const universityResults = useQueries({
        queries: selectedCountries.map((countryId) => ({
            queryKey: ['universities', countryId],
            queryFn: async () => {
                const items = await useGetUniversityByCountry(countryId)

                return {
                    countryId,
                    items: items ?? [],
                }
            },
            enabled: !!countryId,
        })),
    })

    // ============================================================
    // UNIVERSITY MAP
    // ============================================================

    const universitiesMap = useMemo(() => {
        const map: Record<string, any[]> = {}

        universityResults.forEach((result: any) => {
            if (!result.data) return

            map[result.data.countryId] = result.data.items ?? []
        })

        return map
    }, [universityResults])

    // ============================================================
    // ALL UNIVERSITIES
    // ============================================================

    const allUniversities = useMemo(() => {
        const universities = Object.values(universitiesMap).flat()

        const uniqueUniversities = new Map<string, any>()

        universities.forEach((university: any) => {
            if (!university?.id) return

            if (!uniqueUniversities.has(university.id)) {
                uniqueUniversities.set(university.id, university)
            }
        })

        return Array.from(uniqueUniversities.values())
    }, [universitiesMap])

    // ============================================================
    // GET COURSES FOR UNIVERSITIES
    // ============================================================

    const courseResults = useQueries({
        queries: allUniversities.map((university: any) => ({
            queryKey: ['courses', university.id],
            queryFn: async () => {
                const items = await useGetCourseByUniversity(
                    university.id
                )

                return {
                    universityId: university.id,
                    items: items ?? [],
                }
            },
            enabled: !!university.id,
        })),
    })

    // ============================================================
    // COURSES MAP
    // ============================================================

    const coursesByUniversity = useMemo(() => {
        const map: Record<string, any[]> = {}

        courseResults.forEach((result: any) => {
            if (!result.data) return

            map[result.data.universityId] =
                result.data.items ?? []
        })

        return map
    }, [courseResults])

    // ============================================================
    // INITIALIZE SELECTED COUNTRIES WHEN EDITING
    // ============================================================

    useEffect(() => {
        if (!inquiry) return

        if (initializedInquiryId.current === inquiry.id) {
            return
        }

        const countryIds = Array.from(
            new Set(
                (inquiry.countries ?? [])
                    .map((country) => country.countryId)
                    .filter(Boolean)
            )
        )

        setSelectedCountries(countryIds)
    }, [inquiry])

    // ============================================================
    // INITIALIZE COUNTRY / UNIVERSITY / COURSE SELECTIONS
    // ============================================================

    useEffect(() => {
        if (!inquiry) return

        if (initializedInquiryId.current === inquiry.id) {
            return
        }

        const inquiryCountries = inquiry.countries ?? []

        const expectedCountryIds = inquiryCountries
            .map((country) => country.countryId)
            .filter(Boolean)

        /*
         * Wait until all university requests are finished.
         */
        if (
            universityResults.some(
                (result: any) =>
                    result.isPending || result.isLoading
            )
        ) {
            return
        }

        /*
         * Wait until all course requests are finished.
         */
        if (
            courseResults.some(
                (result: any) =>
                    result.isPending || result.isLoading
            )
        ) {
            return
        }

        /*
         * Make sure countries are loaded.
         */
        if (!countries || countries.length === 0) {
            return
        }

        /*
         * If inquiry has countries, wait until selected countries
         * are available.
         */
        if (
            expectedCountryIds.length > 0 &&
            selectedCountries.length !== expectedCountryIds.length
        ) {
            return
        }

        const selections: CountrySelection[] =
            inquiryCountries.map((countryDto) => {
                const country =
                    countries.find(
                        (item: any) =>
                            item.id === countryDto.countryId
                    ) ?? {
                        id: countryDto.countryId,
                        name: countryDto.countryId,
                    }

                const availableUniversities =
                    universitiesMap[countryDto.countryId] ?? []

                const selectedUniversities =
                    (countryDto.universities ?? [])
                        .filter(
                            (universityDto: any) =>
                                universityDto?.universityId
                        )
                        .map((universityDto: any) => {
                            return (
                                availableUniversities.find(
                                    (item: any) =>
                                        item.id ===
                                        universityDto.universityId
                                ) ?? {
                                    id: universityDto.universityId,
                                    name: universityDto.universityId,
                                }
                            )
                        })

                const coursesMap: Record<string, any[]> = {}

                    ; (countryDto.universities ?? []).forEach(
                        (universityDto: any) => {
                            const universityId =
                                universityDto.universityId

                            if (!universityId) return

                            const availableCourses =
                                coursesByUniversity[
                                universityId
                                ] ?? []

                            /*
                             * IMPORTANT:
                             *
                             * Even if courseIds is empty, keep the
                             * university key with an empty array.
                             *
                             * This allows:
                             *
                             * courseIds: []
                             *
                             * to be sent during update.
                             */
                            coursesMap[universityId] = (
                                universityDto.courseIds ?? []
                            )
                                .filter(Boolean)
                                .map((courseId: string) => {
                                    return (
                                        availableCourses.find(
                                            (course: any) =>
                                                course.id ===
                                                courseId
                                        ) ?? {
                                            id: courseId,
                                            title: courseId,
                                        }
                                    )
                                })
                        }
                    )

                return {
                    country,
                    universities: selectedUniversities,
                    coursesMap,
                }
            })

        setCountrySelections(selections)

        initializedInquiryId.current = inquiry.id
    }, [
        inquiry,
        countries,
        selectedCountries.length,
        universitiesMap,
        coursesByUniversity,
        universityResults,
        courseResults,
    ])

    // ============================================================
    // RESET FORM
    // ============================================================

    const handleClose = () => {
        form.reset({
            fullName: '',
            email: '',
            dateOfBirth: '',
            gender: 0,
            contactNumber: '',
            permanentAddress: '',
            educationLevel: 0,
            englishProficiency: 0,
            bandScore: 0,
            languageRemarks: '',

            skillOrTrainingName: '',
            institutionName: '',
            trainingRemarks: '',
            trainingStartDate: '',
            trainingEndDate: '',

            completionYear: '',
            currentGpa: '',
            previousAcademicQualification: '',
            source: '',
            feedBackOrSuggestion: '',

            countries: [
                {
                    countryId: '',
                    universities: [
                        {
                            universityId: '',
                            courseIds: [],
                        },
                    ],
                },
            ],
        })

        setSelectedCountries([])
        setCountrySelections([])

        initializedInquiryId.current = null

        onClose()
    }

    // ============================================================
    // COUNTRY TOGGLE
    // ============================================================

    const handleCountryToggle = (country: any) => {
        if (!country?.id) return

        const countryId = country.id

        const exists = selectedCountries.includes(countryId)

        if (exists) {
            /*
             * Remove country from selected countries.
             */
            setSelectedCountries((prev) =>
                prev.filter((id) => id !== countryId)
            )

            /*
             * Remove complete country selection.
             *
             * This means the payload will no longer contain
             * this country.
             */
            setCountrySelections((prev) =>
                prev.filter(
                    (item) =>
                        item.country.id !== countryId
                )
            )

            return
        }

        /*
         * Add country.
         */
        setSelectedCountries((prev) => [
            ...prev,
            countryId,
        ])

        /*
         * Add country with no universities/courses.
         */
        setCountrySelections((prev) => [
            ...prev,
            {
                country,
                universities: [],
                coursesMap: {},
            },
        ])
    }

    // ============================================================
    // REMOVE COUNTRY
    // ============================================================

    const handleRemoveCountry = (countryId: string) => {
        setSelectedCountries((prev) =>
            prev.filter((id) => id !== countryId)
        )

        setCountrySelections((prev) =>
            prev.filter(
                (item) =>
                    item.country.id !== countryId
            )
        )
    }

    // ============================================================
    // UNIVERSITY TOGGLE
    // ============================================================

    const handleUniversityToggle = (
        countryId: string,
        university: any
    ) => {
        if (!countryId || !university?.id) return

        setCountrySelections((prev) =>
            prev.map((item) => {
                if (item.country.id !== countryId) {
                    return item
                }

                const universityId = university.id

                const exists =
                    item.universities.some(
                        (u: any) =>
                            u.id === universityId
                    )

                /*
                 * University is being unchecked.
                 */
                if (exists) {
                    const updatedUniversities =
                        item.universities.filter(
                            (u: any) =>
                                u.id !== universityId
                        )

                    const updatedCoursesMap = {
                        ...item.coursesMap,
                    }

                    /*
                     * Remove courses belonging to the
                     * unchecked university.
                     */
                    delete updatedCoursesMap[
                        universityId
                    ]

                    return {
                        ...item,
                        universities:
                            updatedUniversities,
                        coursesMap:
                            updatedCoursesMap,
                    }
                }

                /*
                 * University is being checked.
                 *
                 * Keep an empty course array.
                 *
                 * This is important because:
                 *
                 * {
                 *    universityId: "...",
                 *    courseIds: []
                 * }
                 *
                 * means the university exists but has
                 * no selected courses.
                 */
                return {
                    ...item,
                    universities: [
                        ...item.universities,
                        university,
                    ],
                    coursesMap: {
                        ...item.coursesMap,
                        [universityId]:
                            item.coursesMap?.[
                            universityId
                            ] ?? [],
                    },
                }
            })
        )
    }

    // ============================================================
    // COURSE TOGGLE
    // ============================================================

    const handleCourseToggle = (
        countryId: string,
        universityId: string,
        course: any
    ) => {
        if (
            !countryId ||
            !universityId ||
            !course?.id
        ) {
            return
        }

        setCountrySelections((prev) =>
            prev.map((item) => {
                if (item.country.id !== countryId) {
                    return item
                }

                const existingCourses =
                    item.coursesMap?.[
                    universityId
                    ] ?? []

                const exists = existingCourses.some(
                    (c: any) =>
                        c.id === course.id
                )

                let updatedCourses: any[]

                if (exists) {
                    /*
                     * Course unchecked.
                     *
                     * If this is the last course,
                     * updatedCourses becomes [].
                     *
                     * We DO NOT delete the university
                     * from coursesMap.
                     *
                     * This ensures payload sends:
                     *
                     * courseIds: []
                     */
                    updatedCourses =
                        existingCourses.filter(
                            (c: any) =>
                                c.id !== course.id
                        )
                } else {
                    /*
                     * Course checked.
                     */
                    updatedCourses = [
                        ...existingCourses,
                        course,
                    ]
                }

                /*
                 * Remove accidental duplicate course IDs
                 * from frontend state.
                 */
                const uniqueCourses = Array.from(
                    new Map(
                        updatedCourses.map(
                            (course: any) => [
                                course.id,
                                course,
                            ]
                        )
                    ).values()
                )

                return {
                    ...item,
                    coursesMap: {
                        ...item.coursesMap,
                        [universityId]:
                            uniqueCourses,
                    },
                }
            })
        )
    }

    // ============================================================
    // CREATE CLEAN COUNTRIES PAYLOAD
    // ============================================================

    const countriesPayload = useMemo(() => {
        return countrySelections
            .filter(
                (item) =>
                    item?.country?.id
            )
            .map((item) => {
                const uniqueUniversities =
                    new Map<string, any>()

                /*
                 * Remove duplicate universities.
                 */
                item.universities.forEach(
                    (university: any) => {
                        if (!university?.id) {
                            return
                        }

                        if (
                            !uniqueUniversities.has(
                                university.id
                            )
                        ) {
                            uniqueUniversities.set(
                                university.id,
                                university
                            )
                        }
                    }
                )

                return {
                    countryId:
                        item.country.id,

                    universities:
                        Array.from(
                            uniqueUniversities.values()
                        ).map(
                            (university: any) => {
                                const courses =
                                    item.coursesMap?.[
                                    university.id
                                    ] ?? []

                                /*
                                 * Remove duplicate courses.
                                 */
                                const uniqueCourseIds =
                                    Array.from(
                                        new Set(
                                            courses
                                                .filter(
                                                    (course: any) =>
                                                        course?.id
                                                )
                                                .map(
                                                    (course: any) =>
                                                        course.id
                                                )
                                        )
                                    )

                                return {
                                    universityId:
                                        university.id,

                                    /*
                                     * IMPORTANT:
                                     *
                                     * Always send an array.
                                     *
                                     * If all courses are unchecked:
                                     *
                                     * courseIds: []
                                     *
                                     * Backend will delete existing
                                     * courses.
                                     */
                                    courseIds:
                                        uniqueCourseIds,
                                }
                            }
                        ),
                }
            })
    }, [countrySelections])

    // ============================================================
    // SUBMIT
    // ============================================================

    const onSubmit: SubmitHandler<
        AddInquiryPayload
    > = async () => {
        clearError()

        const values = form.getValues()

        const payload: AddInquiryPayload = {
            ...values,
            countries: countriesPayload,
        }

        try {
            // ====================================================
            // UPDATE
            // ====================================================

            if (inquiry) {
                const id =
                    inquiryId?.trim() ||
                    inquiry.id?.trim()

                if (!id) {
                    Toast.error(
                        'Inquiry ID is missing. Close and reopen the inquiry before updating.'
                    )
                    return
                }

                const updatePayload:
                    UpdateInquiryPayload = {
                    ...payload,
                    id,
                }

                await updateInquiry.mutateAsync({
                    id,
                    payload: updatePayload,
                })
            }

            // ====================================================
            // CREATE
            // ====================================================

            else {
                await addInquiry.mutateAsync(
                    payload
                )
            }

            handleClose()
        } catch (error) {
            Toast.error(handleError(error))
        }
    }

    // ============================================================
    // OPTIONS
    // ============================================================

    const genderOptions = [
        { id: 1, name: 'Male' },
        { id: 2, name: 'Female' },
        { id: 3, name: 'Others' },
    ]

    const educationOptions = [
        {
            id: 1,
            name: 'PlusTwoIntermediate',
        },
        {
            id: 2,
            name: 'Bachelors',
        },
        {
            id: 3,
            name: 'Masters',
        },
    ]

    const englishOptions = [
        { id: 1, name: 'IELTS' },
        { id: 2, name: 'TOEFL' },
        { id: 3, name: 'PTE' },
        { id: 4, name: 'DET' },
        { id: 5, name: 'TOEIC' },
        { id: 6, name: 'CELPIP' },
        { id: 7, name: 'OET' },
        { id: 8, name: 'FCE' },
        { id: 9, name: 'CAE' },
        { id: 10, name: 'CPE' },
    ]

    // ============================================================
    // UI
    // ============================================================

    return (
        <div className="inset-0 flex items-center justify-center w-full h-full">
            <div className="w-full h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
                <fieldset>
                    {/* ====================================================
                        HEADER
                    ==================================================== */}

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            {inquiry
                                ? 'Edit Inquiry'
                                : 'Add Inquiry'}
                        </h1>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-red-400 text-2xl hover:text-red-500"
                        >
                            <X strokeWidth={3} />
                        </button>
                    </div>

                    {/* ====================================================
                        FORM
                    ==================================================== */}

                    <form
                        onSubmit={form.handleSubmit(
                            onSubmit
                        )}
                    >
                        {/* ====================================================
                            BASIC INFORMATION
                        ==================================================== */}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                            <div className="col-span-full">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Basic Information
                                </h3>
                            </div>

                            <InputElement
                                label="Full Name"
                                form={form}
                                name="fullName"
                                placeholder="Enter full name"
                                required
                            />

                            <InputElement
                                label="Email"
                                form={form}
                                name="email"
                                placeholder="Enter email"
                                required
                            />

                            <InputElement
                                label="Date of Birth"
                                form={form}
                                name="dateOfBirth"
                                type="date"
                                required
                            />

                            <AppCombobox
                                label="Gender"
                                dropdownPositionClass="absolute"
                                name="gender"
                                form={form}
                                value={gender}
                                options={
                                    genderOptions
                                }
                                dropDownWidth="w-full"
                                selected={
                                    genderOptions.find(
                                        (item) =>
                                            item.id ===
                                            gender
                                    ) || null
                                }
                                onSelect={(option) => {
                                    form.setValue(
                                        'gender',
                                        option?.id ??
                                        0
                                    )
                                }}
                                getLabel={(o) =>
                                    o?.name || ''
                                }
                                getValue={(o) =>
                                    o?.id ?? ''
                                }
                            />

                            <InputElement
                                label="Contact Number"
                                form={form}
                                name="contactNumber"
                                placeholder="Enter contact number"
                                required
                            />

                            <InputElement
                                label="Permanent Address"
                                form={form}
                                name="permanentAddress"
                                placeholder="Enter address"
                                required
                            />

                            {/* ====================================================
                                ACADEMIC
                            ==================================================== */}

                            <div className="col-span-full">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Academic Info
                                </h3>
                            </div>

                            <AppCombobox
                                label="Education Level"
                                dropdownPositionClass="absolute"
                                name="educationLevel"
                                form={form}
                                value={
                                    educationLevel
                                }
                                options={
                                    educationOptions
                                }
                                dropDownWidth="w-full"
                                selected={
                                    educationOptions.find(
                                        (item) =>
                                            item.id ===
                                            educationLevel
                                    ) || null
                                }
                                onSelect={(option) => {
                                    form.setValue(
                                        'educationLevel',
                                        option?.id ??
                                        0
                                    )
                                }}
                                getLabel={(o) =>
                                    o?.name || ''
                                }
                                getValue={(o) =>
                                    o?.id ?? ''
                                }
                                required
                            />

                            <InputElement
                                label="Completion Year"
                                form={form}
                                name="completionYear"
                                placeholder="Enter year"
                                required
                            />

                            <InputElement
                                label="Current GPA"
                                form={form}
                                name="currentGpa"
                                placeholder="Enter GPA"
                                required
                            />

                            <InputElement
                                label="Major Course"
                                form={form}
                                name="previousAcademicQualification"
                                placeholder="Enter qualification"
                                required
                            />

                            {/* ====================================================
                                LANGUAGE
                            ==================================================== */}

                            <div className="col-span-full">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Language Proficiency
                                </h3>
                            </div>

                            <AppCombobox
                                label="English Proficiency"
                                dropdownPositionClass="absolute"
                                name="englishProficiency"
                                form={form}
                                value={
                                    englishProficiency
                                }
                                options={
                                    englishOptions
                                }
                                dropDownWidth="w-full"
                                selected={
                                    englishOptions.find(
                                        (item) =>
                                            item.id ===
                                            englishProficiency
                                    ) || null
                                }
                                onSelect={(option) => {
                                    form.setValue(
                                        'englishProficiency',
                                        option?.id ??
                                        0
                                    )
                                }}
                                getLabel={(o) =>
                                    o?.name || ''
                                }
                                getValue={(o) =>
                                    o?.id ?? ''
                                }
                            />


                            <InputElement
                                label="Band Score"
                                form={form}
                                name="bandScore"
                                type="number"
                                placeholder="Enter band score"

                            />

                            <InputElement
                                label="Language Remarks"
                                form={form}
                                name="languageRemarks"
                                placeholder="Enter remarks"
                            />

                            {/* ====================================================
                                SKILLS / TRAINING
                            ==================================================== */}

                            <InputElement
                                label="Skill / Training Name"
                                form={form}
                                name="skillOrTrainingName"
                                placeholder="Enter skill or training"
                            />

                            <InputElement
                                label="Institution Name"
                                form={form}
                                name="institutionName"
                                placeholder="Enter institution"
                            />

                            <InputElement
                                label="Training Start Date"
                                form={form}
                                name="trainingStartDate"
                                type="date"
                            />

                            <InputElement
                                label="Training End Date"
                                form={form}
                                name="trainingEndDate"
                                type="date"
                            />

                            <InputElement
                                label="Training Remarks"
                                form={form}
                                name="trainingRemarks"
                                placeholder="Enter training remarks"
                            />
                        </div>

                        {/* ====================================================
                            INTERESTED PROGRAM
                        ==================================================== */}

                        <div className="mt-8">
                            <h2 className="font-semibold text-lg mb-3">
                                Interested Program
                            </h2>

                            <div className="border rounded-xl overflow-hidden">
                                {/* HEADER */}

                                <div className="grid grid-cols-3 bg-gray-100 dark:bg-gray-800 font-semibold">
                                    <div className="p-3 border-r">
                                        Country
                                    </div>

                                    <div className="p-3 border-r">
                                        University
                                    </div>

                                    <div className="p-3">
                                        Course
                                    </div>
                                </div>

                                {/* COUNTRIES */}

                                {countries.map(
                                    (
                                        country: any
                                    ) => {
                                        const selection =
                                            countrySelections.find(
                                                (
                                                    item
                                                ) =>
                                                    item
                                                        .country
                                                        .id ===
                                                    country.id
                                            )

                                        return (
                                            <div
                                                key={
                                                    country.id
                                                }
                                                className="grid grid-cols-3 border-t min-h-[80px]"
                                            >
                                                {/* ====================================================
                                                    COUNTRY
                                                ==================================================== */}

                                                <div className="p-3 border-r">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCountries.includes(
                                                                country.id
                                                            )}
                                                            onChange={() =>
                                                                handleCountryToggle(
                                                                    country
                                                                )
                                                            }
                                                        />

                                                        <span>
                                                            {
                                                                country.name
                                                            }
                                                        </span>
                                                    </label>
                                                </div>

                                                {/* ====================================================
                                                    UNIVERSITY
                                                ==================================================== */}

                                                <div className="p-3 border-r space-y-2">
                                                    {selectedCountries.includes(
                                                        country.id
                                                    ) &&
                                                        (
                                                            universitiesMap?.[
                                                            country
                                                                .id
                                                            ] ??
                                                            []
                                                        ).map(
                                                            (
                                                                university: any
                                                            ) => {
                                                                const isSelected =
                                                                    selection?.universities?.some(
                                                                        (
                                                                            item: any
                                                                        ) =>
                                                                            item.id ===
                                                                            university.id
                                                                    ) ??
                                                                    false

                                                                return (
                                                                    <label
                                                                        key={
                                                                            university.id
                                                                        }
                                                                        className="flex items-center gap-2 cursor-pointer"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={
                                                                                isSelected
                                                                            }
                                                                            onChange={() =>
                                                                                handleUniversityToggle(
                                                                                    country.id,
                                                                                    university
                                                                                )
                                                                            }
                                                                        />

                                                                        <span>
                                                                            {
                                                                                university.name
                                                                            }
                                                                        </span>
                                                                    </label>
                                                                )
                                                            }
                                                        )}
                                                </div>

                                                {/* ====================================================
                                                    COURSE
                                                ==================================================== */}

                                                <div className="p-3 space-y-2">
                                                    {selection?.universities?.flatMap(
                                                        (
                                                            university: any
                                                        ) =>
                                                            (
                                                                coursesByUniversity?.[
                                                                university
                                                                    .id
                                                                ] ??
                                                                []
                                                            ).map(
                                                                (
                                                                    course: any
                                                                ) => {
                                                                    const isSelected =
                                                                        selection
                                                                            ?.coursesMap?.[
                                                                            university
                                                                                .id
                                                                        ]?.some(
                                                                            (
                                                                                selectedCourse: any
                                                                            ) =>
                                                                                selectedCourse.id ===
                                                                                course.id
                                                                        ) ??
                                                                        false

                                                                    return (
                                                                        <label
                                                                            key={`${university.id}-${course.id}`}
                                                                            className="flex items-center gap-2 cursor-pointer"
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={
                                                                                    isSelected
                                                                                }
                                                                                onChange={() =>
                                                                                    handleCourseToggle(
                                                                                        country.id,
                                                                                        university.id,
                                                                                        course
                                                                                    )
                                                                                }
                                                                            />

                                                                            <span>
                                                                                {course.title ||
                                                                                    course.name}
                                                                            </span>
                                                                        </label>
                                                                    )
                                                                }
                                                            )
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                        </div>

                        {/* ====================================================
                            SUBMIT
                        ==================================================== */}

                        <div className="flex justify-center mt-6">
                            <ButtonElement
                                type="submit"
                                text={
                                    inquiry
                                        ? 'Update Inquiry'
                                        : 'Submit'
                                }
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    )
}

export default AddInquiryForm