"use client";

import React from "react";
import { X } from "lucide-react";
import {
  useGetAllDistrict,
  useGetAllProvince,
} from "@/components/common/hooks";
import { useGenerateCertificateByStudent } from "../hooks";
import { useGetStudentById } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { useGetAllSchool } from "@/app/admin/Setup/School/hooks";
import { adToBs } from "bikram-sambat-ts";

interface Props {
  studentId: string;
  onClose: () => void;
  examId: string;
}

const formatNepaliDate = (dateValue?: string | Date | null) => {
  if (!dateValue) return "—";

  const dateString =
    dateValue instanceof Date ? dateValue.toISOString() : String(dateValue);
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "—";

  const [, year, month, day] = match;

  try {
    const bs = adToBs(new Date(Number(year), Number(month) - 1, Number(day)));
    return `${bs.year}-${String(bs.month).padStart(2, "0")}-${String(bs.day).padStart(2, "0")} B.S. (${year}/${month}/${day} A.D.)`;
  } catch {
    return "—";
  }
};

const getApiBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!configuredUrl) return "";

  try {
    const url = new URL(configuredUrl);
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return configuredUrl
      .replace(/\/swagger\/index\.html\/?$/i, "")
      .replace(/\/+$/, "");
  }
};

const resolveImageUrl = (imageUrl?: string | File | null): string | null => {
  if (
    typeof imageUrl !== "string" ||
    imageUrl === "-" ||
    imageUrl === "string"
  ) {
    return null;
  }

  const value = imageUrl.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;

  const path = value.replace(/^\/+/, "");
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}/${path}` : `/${path}`;
};

const getTitle = (gender?: number) => (gender === 2 ? "Ms." : "Mr.");
const getRelation = (gender?: number) =>
  gender === 2 ? "daughter of Mr." : "son of Mr.";
const getPronounSubject = (gender?: number) =>
  gender === 2 ? "She" : gender === 1 ? "He" : "They";
const getPronounPossessive = (gender?: number) =>
  gender === 2 ? "Her" : gender === 1 ? "His" : "Their";

const CollegeCertificate: React.FC<Props> = ({
  studentId,
  onClose,
  examId,
}) => {
  const { data: allProvince } = useGetAllProvince();
  const { data: allDistrict } = useGetAllDistrict();
  const { data: studentData } = useGetStudentById(studentId);
  const { data: certificateData } = useGenerateCertificateByStudent(
    studentId,
    examId,
  );
  const { data: schoolResponse } = useGetAllSchool();
  const school = schoolResponse?.Items?.[0];
  const gender = studentData?.genderStatus;

  const provinceName = allProvince?.Items.find(
    (item) => item.Id === Number(certificateData?.provinceId),
  )?.provinceNameInEnglish;
  const districtName = allDistrict?.Items.find(
    (item) => item.Id === Number(certificateData?.districtId),
  )?.districtNameInEnglish;
  const studentImageUrl =
    resolveImageUrl(certificateData?.StudentImage) ??
    resolveImageUrl(studentData?.studentImg);
  const schoolLogoUrl = resolveImageUrl(school?.imageUrl);
  const completionYear = certificateData?.yearOfCompletion
    ? certificateData.yearOfCompletion instanceof Date
      ? String(certificateData.yearOfCompletion.getFullYear())
      : String(certificateData.yearOfCompletion).slice(0, 4)
    : "—";
  const possessive = getPronounPossessive(gender).toLowerCase();

  return (
    <>
      <div className="certificate-modal">
        <section className="certificate-dialog" aria-label="Certificate preview">
          <div className="certificate-toolbar no-print">
            <div>
              <p className="certificate-eyebrow">CERTIFICATE PREVIEW</p>
              <h1>Character Certificate</h1>
            </div>
            <div className="certificate-actions">
              <button
                type="button"
                onClick={() => window.print()}
                className="certificate-print-button"
              >
                Print Certificate
              </button>
              <button
                type="button"
                onClick={onClose}
                className="certificate-close-button"
                aria-label="Close certificate preview"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <article
            id="certificate"
            className="certificate-paper"
            aria-label="Character certificate"
          >
            {schoolLogoUrl && (
              <div
                className="certificate-watermark"
                aria-hidden="true"
                style={{ backgroundImage: `url("${schoolLogoUrl}")` }}
              />
            )}
            <div className="certificate-inner-frame" aria-hidden="true" />
            <header className="certificate-header">
              <div className="certificate-school-logo">
                {schoolLogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={schoolLogoUrl} alt={`${school?.name ?? "School"} logo`} />
                ) : (
                  <div className="certificate-logo-placeholder" aria-hidden="true">
                    {school?.shortName?.slice(0, 3) || "SCHOOL"}
                  </div>
                )}
              </div>
              <div className="certificate-school-heading">
                <h2>{school?.name || "School Name"}</h2>
                {school?.address && <p className="school-address">{school.address}</p>}
                {school?.contactNumber && (
                  <p className="school-contact">Phone: {school.contactNumber}</p>
                )}
              </div>
              <div className="certificate-board-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/nepal.png" alt="Nepal national emblem" />
              </div>
            </header>

            <div className="certificate-title-row">
              <p className="certificate-serial">
                <strong>
                  S. No. {certificateData?.registrationNumber ?? "—"}
                </strong>
              </p>
              <div className="certificate-title-wrap">
                <h1>Character Certificate</h1>
                <div className="title-ornament" aria-hidden="true">
                  ❦ ❧ ❦
                </div>
              </div>
              <div className="student-photo-frame">
                {studentImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={studentImageUrl} alt="Student portrait" />
                ) : (
                  <div className="student-photo-placeholder">Student Photo</div>
                )}
              </div>
            </div>

            <main className="certificate-body">
              <p>
                This is to certify that{" "}
                <strong>
                  {getTitle(gender)} {certificateData?.fullName ?? "—"}
                </strong>
                , {getRelation(gender)}{" "}
                <strong>{certificateData?.parentsName ?? "—"}</strong>, a
                resident of{" "}
                <strong>
                  Ward No. {certificateData?.wardNumber ?? "—"},{" "}
                  {districtName ?? "—"} District, {provinceName ?? "—"} Province
                </strong>
                , was a <strong>bona fide student</strong> of this school.{" "}
                <strong>{getPronounSubject(gender)} successfully passed</strong>{" "}
                the{" "}
                <strong>
                  {certificateData?.certificateProgram ||
                    "Secondary Education Examination (SEE)"}
                </strong>{" "}
                in <strong>{completionYear}</strong> and secured{" "}
                <strong>
                  {certificateData?.percentage != null
                    ? `${certificateData.percentage}%`
                    : "—"}
                </strong>
                {certificateData?.division && (
                  <>
                    {" "}
                    with <strong>{certificateData.division}</strong> division
                  </>
                )}
                . {getPronounPossessive(gender)} conduct during the stay at the
                school was good. According to our records, {possessive} date of
                birth is{" "}
                <strong>{formatNepaliDate(certificateData?.dateOfBirth)}</strong>.
                We have no adverse record regarding {possessive} character.
              </p>
              <p className="certificate-wishes">
                We extend our best wishes for {possessive} future endeavours and
                success in life.
              </p>
            </main>

            <div className="certificate-lower">
              <section className="certificate-details" aria-label="Certificate details">
                <p>
                  <strong>SEE Symbol No.:</strong>{" "}
                  <strong>{certificateData?.symbolNumber ?? "—"}</strong>
                </p>
                <p>
                  <strong>SEE Registration No.:</strong>{" "}
                  <strong>{certificateData?.registrationNumber ?? "—"}</strong>
                </p>
                <p>
                  <strong>Date of Issue:</strong>{" "}
                  <strong>
                    {formatNepaliDate(certificateData?.dateOfIssue)}
                  </strong>
                </p>
              </section>

              <footer className="certificate-footer">
                <div className="signature-block">
                  <div className="signature-line" />
                  <strong>Issuing Staff</strong>
                </div>
                <div className="school-seal-block">
                  <div className="school-seal">
                    {schoolLogoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={schoolLogoUrl} alt="School seal" />
                    ) : (
                      <span>School Seal</span>
                    )}
                  </div>
                  <strong>School Seal</strong>
                </div>
                <div className="signature-block">
                  <div className="signature-line" />
                  <strong>Principal</strong>
                </div>
              </footer>
            </div>
          </article>
        </section>
      </div>

      <style jsx global>{`
        .certificate-modal {
          position: fixed;
          z-index: 50;
          inset: 0;
          display: flex;
          justify-content: center;
          overflow: auto;
          padding: 24px;
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(6px);
        }

        .certificate-dialog {
          width: min(1123px, 100%);
          margin: auto;
        }

        .certificate-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin: 0 auto 16px;
          color: #f8fafc;
        }

        .certificate-toolbar h1 {
          margin: 2px 0 0;
          font-size: 21px;
          font-weight: 650;
          letter-spacing: -0.02em;
        }

        .certificate-eyebrow {
          margin: 0;
          color: #c5a873;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
        }

        .certificate-actions {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          gap: 10px;
        }

        .certificate-print-button,
        .certificate-close-button {
          display: inline-flex;
          min-height: 42px;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 10px;
          cursor: pointer;
          transition:
            background-color 150ms ease,
            transform 150ms ease;
        }

        .certificate-print-button {
          padding: 0 18px;
          background: #d6b879;
          color: #172d50;
          font-size: 14px;
          font-weight: 700;
        }

        .certificate-print-button:hover {
          background: #e6ca8d;
          transform: translateY(-1px);
        }

        .certificate-close-button {
          width: 42px;
          background: rgba(255, 255, 255, 0.12);
          color: white;
        }

        .certificate-close-button:hover {
          background: rgba(255, 255, 255, 0.22);
        }

        .certificate-paper {
          position: relative;
          isolation: isolate;
          width: 100%;
          min-width: 760px;
          aspect-ratio: 297 / 210;
          overflow: hidden;
          padding: 40px 54px 28px;
          color: #171717;
          background-color: #fff;
          background-image: repeating-linear-gradient(
            101deg,
            transparent 0,
            transparent 7px,
            rgba(35, 54, 82, 0.035) 7px,
            rgba(35, 54, 82, 0.035) 8px
          );
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.18);
          font-family: "Times New Roman", Times, serif;
        }

        .certificate-watermark {
          position: absolute;
          z-index: 0;
          inset: 20% 28% 16%;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          opacity: 0.07;
          pointer-events: none;
        }

        .certificate-inner-frame {
          position: absolute;
          z-index: 5;
          inset: 10px;
          border: 12px solid #172d50;
          outline: 1px solid rgba(23, 45, 80, 0.75);
          outline-offset: -17px;
          pointer-events: none;
        }

        .certificate-header {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 140px minmax(0, 1fr) 120px;
          align-items: center;
          gap: 14px;
          min-height: 128px;
          padding: 2px 18px 0;
        }

        .certificate-school-logo,
        .certificate-board-logo {
          display: grid;
          place-items: center;
        }

        .certificate-school-logo img {
          display: block;
          width: 130px;
          height: 108px;
          object-fit: contain;
        }

        .certificate-logo-placeholder {
          display: grid;
          width: 110px;
          height: 90px;
          place-items: center;
          border: 1px solid #9ca3af;
          color: #6b7280;
          font-size: 12px;
        }

        .certificate-school-heading {
          min-width: 0;
          text-align: center;
        }

        .certificate-school-heading h2 {
          overflow-wrap: anywhere;
          margin: 0;
          color: #172d50;
          font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(18px, 3vw, 36px);
          font-weight: 900;
          line-height: 1.08;
          text-transform: uppercase;
        }

        .school-address,
        .school-contact {
          margin: 4px 0 0;
          font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(11px, 1.5vw, 16px);
          font-weight: 700;
          line-height: 1.2;
        }

        .certificate-board-logo img {
          width: 100px;
          height: 100px;
          object-fit: contain;
        }

        .certificate-title-row {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 180px minmax(0, 1fr) 125px;
          align-items: center;
          gap: 12px;
          min-height: 126px;
          padding: 0 22px;
        }

        .certificate-serial {
          align-self: center;
          margin: 0;
          font-size: 17px;
        }

        .certificate-title-wrap {
          text-align: center;
        }

        .certificate-title-wrap h1 {
          margin: 0;
          color: #6f2636;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(24px, 3.7vw, 40px);
          font-style: italic;
          line-height: 1.1;
          text-transform: capitalize;
        }

        .title-ornament {
          margin-top: 2px;
          color: #4d5663;
          font-size: 24px;
          letter-spacing: 3px;
          line-height: 1;
        }

        .student-photo-frame {
          width: 112px;
          height: 128px;
          justify-self: end;
          padding: 3px;
          border: 1px solid #8a8a8a;
          background: #fff;
        }

        .student-photo-frame img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .student-photo-placeholder {
          display: grid;
          width: 100%;
          height: 100%;
          place-items: center;
          color: #777;
          font-size: 12px;
          text-align: center;
        }

        .certificate-body {
          position: relative;
          z-index: 1;
          padding: 0 24px;
          font-size: clamp(14px, 1.52vw, 17px);
          line-height: 1.48;
          text-align: justify;
        }

        .certificate-body p {
          margin: 5px 0 0;
        }

        .certificate-wishes {
          margin-top: 8px !important;
          font-weight: 700;
          font-style: italic;
          text-align: left;
        }

        .certificate-lower {
          position: absolute;
          z-index: 1;
          inset: 0;
          pointer-events: none;
        }

        .certificate-details {
          position: absolute;
          top: 55%;
          left: 7%;
          font-size: 14px;
          line-height: 1.4;
        }

        .certificate-details p {
          margin: 0;
        }

        .certificate-footer {
          position: absolute;
          right: 8%;
          bottom: 12%;
          left: 8%;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          align-items: end;
          gap: 30px;
          text-align: center;
        }

        .signature-block,
        .school-seal-block {
          display: flex;
          min-height: 115px;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          font-size: 15px;
          text-transform: uppercase;
        }

        .signature-line {
          width: min(150px, 90%);
          height: 60px;
          margin-bottom: 5px;
          border-bottom: 1px solid #202020;
        }

        .school-seal {
          display: grid;
          width: 135px;
          height: 120px;
          place-items: center;
          overflow: hidden;
          margin-bottom: 4px;
          border: 2px solid #252525;
          border-radius: 10px;
          color: #777;
          font-size: 12px;
        }

        .school-seal img {
          width: 100%;
          height: 100%;
          padding: 5px;
          object-fit: contain;
          opacity: 0.8;
        }

        @media (max-width: 640px) {
          .certificate-modal {
            padding: 14px;
          }

          .certificate-toolbar h1 {
            font-size: 18px;
          }

          .certificate-print-button {
            min-height: 38px;
            padding: 0 12px;
            font-size: 12px;
          }

          .certificate-close-button {
            width: 38px;
            min-height: 38px;
          }

          .certificate-paper {
            min-width: 760px;
            padding: 34px 40px 24px;
          }

          .certificate-inner-frame {
            inset: 8px;
            border-width: 10px;
            outline-offset: -14px;
          }

          .certificate-header {
            grid-template-columns: 95px minmax(0, 1fr) 80px;
            gap: 8px;
            min-height: 100px;
            padding: 2px 10px 0;
          }

          .certificate-school-logo img {
            width: 90px;
            height: 78px;
          }

          .certificate-logo-placeholder {
            width: 78px;
            height: 68px;
          }

          .certificate-board-logo img {
            width: 70px;
            height: 70px;
          }

          .certificate-school-heading h2 {
            font-size: 24px;
          }

          .school-address,
          .school-contact {
            font-size: 11px;
          }

          .certificate-title-row {
            grid-template-columns: 130px minmax(0, 1fr) 90px;
            min-height: 105px;
            padding: 0 12px;
          }

          .certificate-title-wrap h1 {
            font-size: 28px;
          }

          .student-photo-frame {
            width: 80px;
            height: 96px;
          }

          .certificate-body {
            padding: 0 14px;
            font-size: 14px;
          }

          .certificate-details {
            font-size: 11px;
          }

          .certificate-footer {
            gap: 12px;
          }

          .signature-block,
          .school-seal-block {
            min-height: 88px;
            font-size: 11px;
          }

          .signature-line {
            height: 42px;
          }

          .school-seal {
            width: 100px;
            height: 66px;
          }
        }

        @page {
          size: A4 landscape;
          margin: 0;
        }

        @media print {
          html,
          body {
            width: 297mm;
            height: 210mm;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          body * {
            visibility: hidden !important;
          }

          #certificate,
          #certificate * {
            visibility: visible !important;
          }

          #certificate {
            position: fixed !important;
            inset: 0 auto auto 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            min-width: 0 !important;
            margin: 0 !important;
            padding: 11mm 15mm 9mm !important;
            overflow: hidden !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #certificate .certificate-inner-frame {
            inset: 4mm;
            border-width: 3mm;
            outline-offset: -4mm;
          }

          #certificate .certificate-header {
            grid-template-columns: 32mm minmax(0, 1fr) 27mm;
            gap: 4mm;
            min-height: 34mm;
            padding: 1mm 5mm 0;
          }

          #certificate .certificate-school-logo img {
            width: 30mm;
            height: 25mm;
          }

          #certificate .certificate-board-logo img {
            width: 24mm;
            height: 24mm;
          }

          #certificate .certificate-school-heading h2 {
            font-size: 21pt;
          }

          #certificate .school-address,
          #certificate .school-contact {
            margin-top: 1mm;
            font-size: 10pt;
          }

          #certificate .certificate-title-row {
            grid-template-columns: 42mm minmax(0, 1fr) 30mm;
            min-height: 32mm;
            gap: 3mm;
            padding: 0 5mm;
          }

          #certificate .certificate-serial {
            font-size: 11pt;
          }

          #certificate .certificate-title-wrap h1 {
            font-size: 23pt;
          }

          #certificate .title-ornament {
            margin-top: 1mm;
            font-size: 15pt;
          }

          #certificate .student-photo-frame {
            width: 28mm;
            height: 31mm;
          }

          #certificate .certificate-body {
            padding: 0 6mm;
            font-size: 12.5pt;
            line-height: 1.4;
          }

          #certificate .certificate-body p {
            margin-top: 1mm;
          }

          #certificate .certificate-wishes {
            margin-top: 2mm !important;
          }

          #certificate .certificate-details {
            top: 55%;
            left: 7%;
            font-size: 10pt;
            line-height: 1.3;
          }

          #certificate .certificate-footer {
            right: 8%;
            bottom: 12%;
            left: 8%;
            gap: 8mm;
          }

          #certificate .signature-block,
          #certificate .school-seal-block {
            min-height: 31mm;
            font-size: 10pt;
          }

          #certificate .signature-line {
            width: 40mm;
            height: 18mm;
            margin-bottom: 1.5mm;
          }

          #certificate .school-seal {
            width: 36mm;
            height: 31mm;
            margin-bottom: 1mm;
            border-radius: 2mm;
            font-size: 8pt;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default CollegeCertificate;
