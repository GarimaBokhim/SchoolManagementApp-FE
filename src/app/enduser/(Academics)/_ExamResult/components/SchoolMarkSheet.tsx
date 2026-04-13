'use client'

import { X } from 'lucide-react'
import { useGenerateMarkSheet } from '../hooks'
import { useGetAllSubjects } from '../../Subject/hooks'
import { useGetStudentById } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { useGetSchoolById } from '@/app/admin/Setup/School/hooks'
import { useRef, useEffect } from 'react'
import { useGetAllExams } from '../../Exam/hooks'
import { useGetClassById } from '../../Class/hooks'
import { IExam } from '../../Exam/types/IExams'
import { useGetAttendenceCount } from '@/app/enduser/(StudentManagement)/_StudentAttendance/hooks'
import { useGetAllDistricts ,useGetAllProvinces} from '../hooks/locationoHooks'
interface Props {
  studentId: string
  examId: string
  onClose: () => void
}

const SchoolMarkSheet: React.FC<Props> = ({ studentId, examId, onClose }) => {
  const { data } = useGenerateMarkSheet(studentId, examId)
  const { data: allSubject } = useGetAllSubjects()
  const { data: StudentData } = useGetStudentById(studentId)
  const { data: allExam } = useGetAllExams()
  const { data: allclass } = useGetClassById(StudentData?.classId || '')
  const { data: allattendencecount } = useGetAttendenceCount(studentId)
  const { data: allDistricts } = useGetAllDistricts()
  const { data: allProvinces } = useGetAllProvinces()

  const storedUser = localStorage.getItem('userDetails')
  let schoolId = ''
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser)
      schoolId = parsedUser.schoolId
    } catch (error) {
      console.error('Failed to parse user details:', error)
    }
  }

  const { data: SchoolData } = useGetSchoolById(schoolId)
  const modalRef = useRef<HTMLDivElement>(null)
  const ExamName = allExam?.Items.find(
    (exam: IExam) => exam.id === examId
  )?.name

  //Resolve district and province names from IDs
  const districtName = allDistricts?.Items?.find(
    (d) => d.Id === StudentData?.districtId
  )?.districtNameInEnglish ?? '-'

  const provinceName = allProvinces?.Items?.find(
    (p) => p.Id === StudentData?.provinceId
  )?.provinceNameInEnglish ?? '-'

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handlePrint = () => {
    const content = document.getElementById('marksheet')?.outerHTML
    if (!content) return
    const printWindow = window.open('', '', 'width=900,height=1000')
    printWindow?.document.write(`
  <html>
    <head>
      <title>Marksheet</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        * {
          font-family: 'Noto Sans Devanagari', 'Times New Roman', 'Arial', sans-serif;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @media print {
          @page { size: A4 portrait; margin: 0 !important; }
          body { margin: 0; padding: 0; }
          body * { visibility: hidden; }
          #marksheet, #marksheet * { visibility: visible; }
          #marksheet { position: absolute; top: 0; left: 0; width: 210mm; height: 297mm; padding: 20mm; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      </style>
    </head>
    <body>${content}</body>
  </html>
`)
    printWindow?.document.close()
    printWindow?.focus()
    printWindow?.print()
  }

  const getGradePointValue = (grade: string): number => {
    const gradeMap: { [key: string]: number } = {
      'A+': 4.0,
      A: 3.6,
      'B+': 3.2,
      B: 2.8,
      'C+': 2.4,
      C: 2.0,
      'D+': 1.6,
      D: 1.6,
      NG: 0,
    }
    return gradeMap[grade] ?? 0
  }

  const calculateGPA = (): string => {
    if (!data?.MarksWithGrades || data.MarksWithGrades.length === 0) return '-'
    const total = data.MarksWithGrades.reduce((sum, m) => {
      const gp =
        m.GPA !== undefined && m.GPA !== null
          ? parseFloat(m.GPA)
          : getGradePointValue(m.grade)
      return sum + gp
    }, 0)
    return (total / data.MarksWithGrades.length).toFixed(2)
  }

  const gpa = calculateGPA()
  const today = new Date().toISOString().split('T')[0]
  const blue = '#080ccb'
  const headerBg = '#e6e7ff'
  const headerColor = '#080ccb'

  // Format date of birth
  const dateOfBirth = StudentData?.dateOfBirth
    ? new Date(StudentData.dateOfBirth).toISOString().split('T')[0]
    : '-'

  return (
    <div className="fixed inset-0 z-50 ml-13 md:ml-64 sm:ml-16 xs:ml-0 bg-black/40 backdrop-blur-sm items-center justify-center p-2 flex flex-col">
      <div
        ref={modalRef}
        className="bg-white w-full sm:w-[90%] max-w-[1000px] rounded-md p-4 shadow-xl overflow-y-auto max-h-[95vh]"
      >
        <div
          id="marksheet"
          className="bg-white shadow-2xl mx-auto border-2 text-gray-800 p-4 sm:p-6"
          style={{ fontFamily: "'Noto Sans Devanagari', 'Times New Roman', 'Arial', sans-serif" }}
        >
          <div className="p-3 sm:p-5">

            {/* ── HEADER ── */}
            <header className="pb-4 mb-2 relative">
              <div className="flex items-center justify-center w-full relative min-h-[130px]">

                {/* Left: School Logo */}
                <div className="absolute left-0 top-0 w-24 h-24 flex items-center justify-center">
                  <img
                    src="/assets/nepal.png"
                    alt="School Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Center: School Info */}
                <div className="text-center flex-1 px-28">
                  <div className="text-sm font-semibold">नेपाल सरकार</div>
                  <div className="text-sm font-medium">Government of Nepal</div>
                  <div className="text-lg font-bold text-red-600">
                    {SchoolData?.name || 'नमुना नगरपालिका'}
                  </div>
                  <div className="text-sm font-medium">
                    {SchoolData?.address || 'Model Municipality'}
                  </div>
                  <div className="text-sm font-semibold mt-1">
                    स्थानीय परीक्षा बोर्ड
                  </div>
                  <div className="text-sm font-semibold">
                    Local Examination Board
                  </div>
                  <div className="text-xl font-bold mt-2 underline tracking-wide">
                    GRADE SHEET
                  </div>
                </div>

                {/* Right: Student Photo */}
                {StudentData?.studentImg && (
                  <div className="absolute right-0 top-0 w-28 h-[130px] border border-gray-400 flex items-center justify-center overflow-hidden bg-gray-50">
                    <img
                      src={`https://schoolapp.netraverselabs.com/${StudentData.studentImg}`}
                      alt="Student Image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </header>

            {/* ── STUDENT INFO ── */}
            <div
              className="text-sm mb-4 mt-3 leading-7 text-justify px-1"
              style={{ color: blue }}
            >
              <p>
                THE GRADE(S) SECURED BY{' '}
                <span className="font-bold text-black">
                  {[StudentData?.firstName, StudentData?.middleName, StudentData?.lastName]
                    .filter(Boolean)
                    .join(' ') || '-'}
                </span>
                {' '}DATE OF BIRTH:{' '}
                <span className="font-bold text-black">
                  {dateOfBirth}
                </span>
                {' '}SYMBOL NO.:{' '}
                <span className="font-bold text-black">
                  {StudentData?.admissionNumber || '-'}
                </span>
                {' '}REGISTRATION NO.:{' '}
                <span className="font-bold text-black">
                  {StudentData?.registrationNumber || '-'}
                </span>
                {' '}GRADE:{' '}
                <span className="font-bold text-black">
                  {allclass?.name || '-'}
                </span>
                {' '}SCHOOL:{' '}
                <span className="font-bold text-black">
                  {SchoolData?.name || '-'}
                </span>
                {' '}DISTRICT:{' '}
                <span className="font-bold text-black">
                  {districtName}
                </span>
                {' '}PROVINCE:{' '}
                <span className="font-bold text-black">
                  {provinceName}
                </span>
                {' '}IN THE ANNUAL BASIC EDUCATION EXAMINATION{' '}
                <span className="font-bold text-black">
                  {ExamName ? ExamName.toUpperCase() : ''}
                </span>
                {' '}ARE GIVEN BELOW:
              </p>
            </div>

            {/* ── SUBJECTS TABLE ── */}
            <table
              className="w-full border-collapse text-sm mb-4"
              style={{ border: `1px solid ${blue}` }}
            >
              <thead>
                <tr style={{ backgroundColor: headerBg, color: headerColor }}>
                  <th
                    rowSpan={2}
                    className="p-2 text-center font-bold"
                    style={{ border: `1px solid ${blue}`, width: '40px' }}
                  >
                    SN
                  </th>
                  <th
                    rowSpan={2}
                    className="p-2 text-center font-bold"
                    style={{ border: `1px solid ${blue}` }}
                  >
                    SUBJECTS
                  </th>
                  <th
                    rowSpan={2}
                    className="p-2 text-center font-bold"
                    style={{ border: `1px solid ${blue}`, width: '80px' }}
                  >
                    CREDIT HOURS
                  </th>
                  <th
                    colSpan={3}
                    className="p-2 text-center font-bold"
                    style={{ border: `1px solid ${blue}` }}
                  >
                    OBTAINED GRADE
                  </th>
                  <th
                    rowSpan={2}
                    className="p-2 text-center font-bold"
                    style={{ border: `1px solid ${blue}`, width: '90px' }}
                  >
                    GRADE POINT
                  </th>
                  <th
                    rowSpan={2}
                    className="p-2 text-center font-bold"
                    style={{ border: `1px solid ${blue}`, width: '80px' }}
                  >
                    REMARKS
                  </th>
                </tr>
                <tr style={{ backgroundColor: headerBg, color: headerColor }}>
                  <th
                    className="p-2 text-center font-bold"
                    style={{ border: `1px solid ${blue}`, width: '55px' }}
                  >
                    TH
                  </th>
                  <th
                    className="p-2 text-center font-bold"
                    style={{ border: `1px solid ${blue}`, width: '55px' }}
                  >
                    PR
                  </th>
                  <th
                    className="p-2 text-center font-bold"
                    style={{ border: `1px solid ${blue}`, width: '65px' }}
                  >
                    FINAL
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.MarksWithGrades && data.MarksWithGrades.length > 0
                  ? data.MarksWithGrades.map((m, index) => {
                      const subjectName =
                        allSubject?.Items.find((i) => i.Id === m.subjectId)?.name ||
                        m.subjectId ||
                        '-'
                      const gradePoint =
                        m.GPA !== undefined && m.GPA !== null
                          ? m.GPA
                          : getGradePointValue(m.grade)
                      return (
                        <tr
                          key={index}
                          className="text-center"
                          style={{ backgroundColor: '#ffffff', color: blue }}
                        >
                          <td className="p-2" style={{ border: `1px solid ${blue}` }}>
                            {index + 1}
                          </td>
                          <td className="p-2 text-left px-3" style={{ border: `1px solid ${blue}`, color: blue }}>
                            {subjectName}
                          </td>
                          <td className="p-2" style={{ border: `1px solid ${blue}` }}>
                            4
                          </td>
                          <td className="p-2" style={{ border: `1px solid ${blue}` }}>
                            {'-'}
                          </td>
                          <td className="p-2" style={{ border: `1px solid ${blue}` }}>
                            {'-'}
                          </td>
                          <td className="p-2 font-medium" style={{ border: `1px solid ${blue}` }}>
                            {m.grade || '-'}
                          </td>
                          <td className="p-2" style={{ border: `1px solid ${blue}` }}>
                            {gradePoint}
                          </td>
                          <td className="p-2" style={{ border: `1px solid ${blue}` }}>
                            {'-'}
                          </td>
                        </tr>
                      )
                    })
                  : [
                      'Nepali',
                      'English',
                      'Mathematics',
                      'Social Studies and Population Education',
                      'Science and Environment',
                      'Health and Physical Education',
                      'Moral Education',
                      'Occupation, Business & Technology Education',
                      'Local Subject (Computer)',
                    ].map((subject, index) => (
                      <tr
                        key={index}
                        className="text-center"
                        style={{ backgroundColor: '#ffffff', color: blue }}
                      >
                        <td className="p-2" style={{ border: `1px solid ${blue}` }}>{index + 1}</td>
                        <td className="p-2 text-left px-3" style={{ border: `1px solid ${blue}`, color: blue }}>{subject}</td>
                        <td className="p-2" style={{ border: `1px solid ${blue}` }}>4</td>
                        <td className="p-2" style={{ border: `1px solid ${blue}` }}>-</td>
                        <td className="p-2" style={{ border: `1px solid ${blue}` }}>-</td>
                        <td className="p-2" style={{ border: `1px solid ${blue}` }}>-</td>
                        <td className="p-2" style={{ border: `1px solid ${blue}` }}>-</td>
                        <td className="p-2" style={{ border: `1px solid ${blue}` }}>-</td>
                      </tr>
                    ))}

                {/* GPA Row */}
                <tr style={{ backgroundColor: headerBg, color: headerColor }}>
                  <td
                    colSpan={6}
                    className="p-2 text-right font-bold"
                    style={{ border: `1px solid ${blue}` }}
                  >
                    GRADE POINT AVERAGE (GPA):
                  </td>
                  <td
                    className="p-2 text-center font-bold"
                    style={{ border: `1px solid ${blue}` }}
                  >
                    {gpa}
                  </td>
                  <td className="p-2" style={{ border: `1px solid ${blue}` }} />
                </tr>
              </tbody>
            </table>

            {/* ── FOOTER ── */}
            <div className="mt-4 pt-2 text-xs" style={{ color: blue }}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-1 text-xs">
                  <p>1. One Credit Hour Equals 32 Clock Hours</p>
                  <p>2. TH: Theory &nbsp;&nbsp; Pr: Practical</p>
                  <p>3. Abs / Ab*: Absent</p>
                  <p className="ml-4">T*: Theory Grade Missing</p>
                  <p className="ml-4">P*: Practical Grade Missing</p>
                  <div className="mt-6">
                    <p className="font-semibold">Checked By</p>
                  </div>
                  <p className="mt-8">
                    <span className="font-semibold">Date of Issue:</span>{' '}
                    {today}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-end mt-auto">
                  <p className="font-semibold">EDUCATION OFFICER</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
          >
            Print Marksheet
          </button>
        </div>
      </div>
    </div>
  )
}

export default SchoolMarkSheet