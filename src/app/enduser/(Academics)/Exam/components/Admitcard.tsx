"use client";
import React, { forwardRef } from "react";

const AdmitCard = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="w-[820px] h-[280px] bg-white border border-gray-400 shadow-md rounded-md font-sans select-none"
      style={{ userSelect: "none" }}
    >
      {/* HEADER */}
      <div className="relative h-[80px] bg-blue-900 text-white rounded-t-md overflow-visible">
        {/* SVG Yellow curve */}
        <svg
          className="absolute top-0 right-0 h-full w-[300px]"
          viewBox="0 0 300 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,80 C150,0 300,0 300,80 Z"
            fill="#FFD300" /* Bright Yellow */
          />
        </svg>

        {/* Logo */}
        <div className="absolute left-5 top-4 w-16 h-16 bg-white rounded-full border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm">
          {/* Replace below with your actual logo */}
          <img
            src="/logo.png"
            alt="Saraswati School Logo"
            className="object-contain h-full"
          />
        </div>

        <div className="text-center pt-4 relative z-10">
          <h1 className="text-xl font-extrabold text-yellow-400 leading-tight">
            Saraswati Higher Secondary School
          </h1>
          <p className="text-xs mt-0.5">Birtamode-4, Jhapa</p>
          <p className="text-xs mt-0.5">Phone No. 023-544722</p>
        </div>
      </div>

      {/* BODY */}
      <div className="flex h-[170px]">
        {/* LEFT VERTICAL STRIP */}
        <div className="w-10 bg-blue-900 text-yellow-400 flex items-center justify-center rounded-bl-md rounded-tl-md">
          <span className="rotate-[-90deg] text-xs font-bold tracking-widest select-none">
            EXAM ADMIT CARD
          </span>
        </div>

        {/* DETAILS */}
        <div className="flex-1 p-6 text-sm space-y-4 relative">
          {/* Student Name */}
          <div>
            <span className="font-semibold select-none">Student Name:</span>
            <span className="inline-block border-b border-black w-[280px] ml-2" />
          </div>

          {/* Class and Roll No */}
          <div className="flex gap-10">
            <div>
              <span className="font-semibold select-none">Class:</span>
              <span className="inline-block border-b border-black w-[55px] ml-2" />
            </div>
            <div>
              <span className="font-semibold select-none">Roll No.:</span>
              <span className="inline-block border-b border-black w-[75px] ml-2" />
            </div>
          </div>

          {/* Section and Symbol No */}
          <div className="flex gap-10">
            <div>
              <span className="font-semibold select-none">Sec:</span>
              <span className="inline-block border-b border-black w-[55px] ml-2" />
            </div>
            <div>
              <span className="font-semibold select-none">Symbol No.:</span>
              <span className="inline-block border-b border-black w-[90px] ml-2" />
            </div>
          </div>

          {/* Exam Time + Horizontal line */}
          <div className="flex items-center gap-6">
            <div>
              <span className="font-semibold select-none">Exam Time:</span>
              <span className="inline-block border-b border-black w-[150px] ml-2" />
            </div>
            {/* Horizontal line to signature */}
            <div className="flex-1 border-t border-black" />
          </div>

          {/* Signature label */}
          <div className="absolute right-6 bottom-6 text-xs font-semibold select-none">
            Principal Signature
          </div>
        </div>

        {/* PHOTO */}
        <div className="w-[160px] p-5 flex flex-col justify-between items-center">
          <div className="w-[90px] h-[110px] border border-gray-700 flex items-center justify-center text-xs font-semibold select-none">
            PHOTO
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="h-[30px] bg-blue-900 text-yellow-400 text-center text-xs flex items-center justify-center rounded-b-md select-text">
        www.saraswati.edu.np
      </div>
    </div>
  );
});

AdmitCard.displayName = "AdmitCard";
export default AdmitCard;
