'use client'
import { useMemo, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddInquiryPayload } from '../types/IVisitors'
import { SubmitHandler, useFieldArray, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddInquiry, useGetAllCountry, useGetCourseByUniversity, useGetUniversityByCountry } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useQueries } from '@tanstack/react-query';

type Props = {
    form: UseFormReturn<AddInquiryPayload>;
    onClose: () => void;
};
const AddInquiryForm = ({ form, onClose }: Props) => {
    const addInquiry = useAddInquiry();
    const { handleError, clearError } = useErrorHandler();
    const [gender, setGender] = useState<number | null>(null);
    const [educationLevel, setEducationLevel] = useState<number | null>(null);
    const [englishProficiency, setEnglishProficiency] = useState<number | null>(null);
    const [countrySelections, setCountrySelections] = useState<any[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const { data: countries = [] } = useGetAllCountry();

    const universityResults = useQueries({
        queries: selectedCountries.map((countryId) => ({
            queryKey: ["universities", countryId],
            queryFn: async () => {
                const items = await useGetUniversityByCountry(countryId);

                return {
                    countryId,
                    items,
                };
            },
        })),
    });



    const universitiesMap = useMemo(() => {
        const map: Record<string, any[]> = {};

        universityResults.forEach((result: any) => {
            if (!result.data) return;

            map[result.data.countryId] = result.data.items;
        });

        return map;
    }, [universityResults]);

    const allUniversities = useMemo(() => {
        return Object.values(universitiesMap).flat();
    }, [universitiesMap]);


    const courseResults = useQueries({
        queries: allUniversities.map((uni: any) => ({
            queryKey: ["courses", uni.id],
            queryFn: async () => {
                const items = await useGetCourseByUniversity(uni.id);

                return {
                    universityId: uni.id,
                    items,
                };
            },
            enabled: !!uni.id,
        })),
    });
    const coursesByUniversity = useMemo(() => {
        const map: Record<string, any[]> = {};

        courseResults.forEach((result: any) => {
            if (!result.data) return;

            map[result.data.universityId] = result.data.items;
        });

        return map;
    }, [courseResults]);



    const handleClose = () => {
        form.reset({
            fullName: "",
            email: "",
            dateOfBirth: "",
            gender: 0,
            contactNumber: "",
            permanentAddress: "",
            educationLevel: 0,
            englishProficiency: 0,
            bandScore: 0,
            languageRemarks: "",

            skillOrTrainingName: "",
            institutionName: "",
            trainingRemarks: "",
            trainingStartDate: "",
            trainingEndDate: "",

            completionYear: "",
            currentGpa: "",
            previousAcademicQualification: "",
            source: "",
            feedBackOrSuggestion: "",

            countries: [
                {
                    countryId: "",
                    universities: [
                        {
                            universityId: "",
                            courseIds: [""]
                        }
                    ]
                }
            ]
        });
        setSelectedCountries([]);
        setCountrySelections([]);
        onClose();
    };

    // ================= COUNTRY TOGGLE =================
    const handleCountryToggle = (country: any) => {
        const exists = selectedCountries.includes(country.id);

        if (exists) {
            setSelectedCountries(prev =>
                prev.filter(id => id !== country.id)
            );

            setCountrySelections(prev =>
                prev.filter(x => x.country.id !== country.id)
            );

            return;
        }

        setSelectedCountries(prev => [...prev, country.id]);

        setCountrySelections(prev => [
            ...prev,
            {
                country,
                universities: [],
                coursesMap: {},
            },
        ]);
    };

    // ================= REMOVE COUNTRY =================
    const handleRemoveCountry = (countryId: string) => {
        setSelectedCountries(prev => prev.filter(id => id !== countryId));
        setCountrySelections(prev =>
            prev.filter(x => x.country.id !== countryId)
        );
    };

    // ================= UNIVERSITY TOGGLE =================
    const handleUniversityToggle = (
        countryId: string,
        university: any
    ) => {
        setCountrySelections(prev =>
            prev.map(item => {
                if (item.country.id !== countryId) return item;

                const exists = item.universities.some(
                    (u: any) => u.id === university.id
                );

                const updatedUniversities = exists
                    ? item.universities.filter(
                        (u: any) => u.id !== university.id
                    )
                    : [...item.universities, university];

                const updatedCoursesMap = { ...item.coursesMap };

                if (exists) {
                    delete updatedCoursesMap[university.id];
                }

                return {
                    ...item,
                    universities: updatedUniversities,
                    coursesMap: updatedCoursesMap,
                };
            })
        );
    };

    // ================= COURSE TOGGLE =================
    const handleCourseToggle = (
        countryId: string,
        universityId: string,
        course: any
    ) => {
        setCountrySelections(prev =>
            prev.map(item => {
                if (item.country.id !== countryId) return item;

                const existing =
                    item.coursesMap?.[universityId] || [];

                const exists = existing.some(
                    (c: any) => c.id === course.id
                );

                const updatedCourses = exists
                    ? existing.filter(
                        (c: any) => c.id !== course.id
                    )
                    : [...existing, course];

                return {
                    ...item,
                    coursesMap: {
                        ...item.coursesMap,
                        [universityId]: updatedCourses,
                    },
                };
            })
        );
    };

    const onSubmit: SubmitHandler<AddInquiryPayload> = async () => {
        clearError();
        const values = form.getValues();

        const payload: AddInquiryPayload = {
            ...values,
            countries: countrySelections.map(item => ({
                countryId: item.country.id,
                universities: item.universities.map((u: any) => ({
                    universityId: u.id,
                    courseIds: item.coursesMap?.[u.id]?.map((c: any) => c.id) || []
                }))
            }))
        };

        await addInquiry.mutateAsync(payload);
        handleClose();
        onClose();
    };


    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Add Inquiry
                        </h1>
                        <button
                            type="button"
                            onClick={() => {
                                handleClose();
                                onClose();
                            }}
                            className="text-red-400 text-2xl hover:text-red-500"
                        >
                            <X strokeWidth={3} />
                        </button>
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                options={[
                                    { id: 1, name: 'Male' },
                                    { id: 2, name: 'Female' },
                                    { id: 3, name: 'Others' }
                                ]}
                                dropDownWidth="w-full"
                                selected={
                                    [
                                        { id: 1, name: 'Male' },
                                        { id: 2, name: 'Female' },
                                        { id: 3, name: 'Others' }
                                    ].find((g) => g.id === gender) || null
                                }
                                onSelect={(option) => {
                                    setGender(option?.id ?? null);
                                    form.setValue('gender', option?.id ?? 0);
                                }}
                                getLabel={(o) => o?.name || ''}
                                getValue={(o) => o?.id ?? ''}
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

                            <div className="col-span-full">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    AcademicInfo
                                </h3>
                            </div>

                            {/* ================= ACADEMIC INFO ================= */}

                            <AppCombobox
                                label="Education Level"
                                dropdownPositionClass="absolute"
                                name="educationLevel"
                                form={form}
                                value={educationLevel}
                                options={[
                                    { id: 1, name: 'PlusTwoIntermediate' },
                                    { id: 2, name: 'Bachelors' },
                                    { id: 3, name: 'Masters' }
                                ]}
                                dropDownWidth="w-full"
                                selected={
                                    [
                                        { id: 1, name: 'PlusTwoIntermediate' },
                                        { id: 2, name: 'Bachelors' },
                                        { id: 3, name: 'Masters' }
                                    ].find((g) => g.id === educationLevel) || null
                                }
                                onSelect={(option) => {
                                    setEducationLevel(option?.id ?? null);
                                    form.setValue('educationLevel', option?.id ?? 0);
                                }}
                                getLabel={(o) => o?.name || ''}
                                getValue={(o) => o?.id ?? ''}
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
                                label="Previous Qualification"
                                form={form}
                                name="previousAcademicQualification"
                                placeholder="Enter qualification"
                                required
                            />

                            {/* ================= ENGLISH PROFICIENCY ================= */}

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
                                value={englishProficiency}
                                options={[
                                    { id: 1, name: 'IELTS' },
                                    { id: 2, name: 'TOEFL' },
                                    { id: 3, name: 'PTE' },
                                    { id: 4, name: 'DET' },
                                    { id: 5, name: 'TOEIC' },
                                    { id: 6, name: 'CELPIP' },
                                    { id: 7, name: 'OET' },
                                    { id: 8, name: 'FCE' },
                                    { id: 9, name: 'CAE' },
                                    { id: 10, name: 'CPE' }
                                ]}
                                dropDownWidth="w-full"
                                selected={
                                    [
                                        { id: 1, name: 'IELTS' },
                                        { id: 2, name: 'TOEFL' },
                                        { id: 3, name: 'PTE' },
                                        { id: 4, name: 'DET' },
                                        { id: 5, name: 'TOEIC' },
                                        { id: 6, name: 'CELPIP' },
                                        { id: 7, name: 'OET' },
                                        { id: 8, name: 'FCE' },
                                        { id: 9, name: 'CAE' },
                                        { id: 10, name: 'CPE' }
                                    ].find((g) => g.id === englishProficiency) || null
                                }
                                onSelect={(option) => {
                                    setEnglishProficiency(option?.id ?? null);
                                    form.setValue('englishProficiency', option?.id ?? 0);
                                }}
                                getLabel={(o) => o?.name || ''}
                                getValue={(o) => o?.id ?? ''}
                            />

                            <InputElement
                                label="Band Score"
                                form={form}
                                name="bandScore"
                                type="number"
                                placeholder="Enter band score"
                                required
                            />

                            <InputElement
                                label="Language Remarks"
                                form={form}
                                name="languageRemarks"
                                placeholder="Enter remarks"
                            />

                            {/* ================= SKILLS / TRAINING ================= */}
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

                        {/* ================= INTERESTED PROGRAM SECTION ================= */}
                        <div className="mt-8">
                            <h2 className="font-semibold text-lg mb-3">
                                Interested Program
                            </h2>

                            <div className="border rounded-xl overflow-hidden">

                                {/* Header */}
                                <div className="grid grid-cols-3 bg-gray-100 dark:bg-gray-800 font-semibold">
                                    <div className="p-3 border-r">Country</div>
                                    <div className="p-3 border-r">University</div>
                                    <div className="p-3">Course</div>
                                </div>

                                {countries.map((country: any) => {
                                    const selection = countrySelections.find(
                                        (x: any) => x.country.id === country.id
                                    );

                                    return (
                                        <div
                                            key={country.id}
                                            className="grid grid-cols-3 border-t min-h-[80px]"
                                        >
                                            {/* COUNTRY COLUMN */}
                                            <div className="p-3 border-r">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCountries.includes(
                                                            country.id
                                                        )}
                                                        onChange={() =>
                                                            handleCountryToggle(country)
                                                        }
                                                    />
                                                    <span>{country.name}</span>
                                                </label>
                                            </div>

                                            {/* UNIVERSITY COLUMN */}
                                            <div className="p-3 border-r space-y-2">
                                                {selectedCountries.includes(country.id) &&
                                                    (universitiesMap?.[country.id] || []).map(
                                                        (uni: any) => (
                                                            <label
                                                                key={uni.id}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        selection?.universities?.some(
                                                                            (u: any) =>
                                                                                u.id === uni.id
                                                                        ) || false
                                                                    }
                                                                    onChange={() =>
                                                                        handleUniversityToggle(
                                                                            country.id,
                                                                            uni
                                                                        )
                                                                    }
                                                                />
                                                                <span>{uni.name}</span>
                                                            </label>
                                                        )
                                                    )}
                                            </div>

                                            {/* COURSE COLUMN */}
                                            <div className="p-3 space-y-2">
                                                {selection?.universities?.flatMap(
                                                    (uni: any) =>
                                                        (coursesByUniversity?.[
                                                            uni.id
                                                        ] || []).map((course: any) => (
                                                            <label
                                                                key={course.id}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        selection?.coursesMap?.[
                                                                            uni.id
                                                                        ]?.some(
                                                                            (c: any) =>
                                                                                c.id ===
                                                                                course.id
                                                                        ) || false
                                                                    }
                                                                    onChange={() =>
                                                                        handleCourseToggle(
                                                                            country.id,
                                                                            uni.id,
                                                                            course
                                                                        )
                                                                    }
                                                                />
                                                                <span>
                                                                    {course.title ||
                                                                        course.name}
                                                                </span>
                                                            </label>
                                                        ))
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        <div className="flex justify-center mt-6">
                            <ButtonElement type="submit" text={"Submit"} />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    );
};

export default AddInquiryForm;
