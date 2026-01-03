import React from "react";
import { Link } from "react-router-dom";

//hero section enroll button
export default function HeroEnroll() {
  return (
    <Link
      to="/role"
      className="
        inline-flex items-center gap-2
        bg-green-600 text-white px-10 py-4
        rounded-xl font-bold text-lg
        transition-all shadow-lg
        hover:bg-primary-dark hover:-translate-y-1 hover:shadow-2xl
      "
    >
      Enroll Now 
    </Link>
  );
}

//empowering lives enroll and feature button
export function EmpowerEnroll() {
  return (
    <div className="flex gap-4  flex-row md:flex-col">

      {/* Enroll Now */}
      <a
        href="role"
        className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-3 md:px-7 md:py-3.5 rounded-lg font-semibold transition-all border-2 border-primary hover:bg-primary hover:text-white md:w-full md:justify-center"
      >
        Enroll Now →
      </a>

      {/* Learn More */}
      <a
        href="#features"
        className="inline-flex items-center gap-2 bg-yellow-400 text-white px-3 py-3 md:px-7 md:py-3.5 rounded-lg font-semibold transition-all border-2 border-primary hover:bg-primary hover:text-white md:w-full md:justify-center"
      >
        Learn More →
      </a>

    </div>
  );
}