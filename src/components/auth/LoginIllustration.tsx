"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const LoginIllustration: React.FC = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-950">
      <Image 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtPLHb-FvhV53a7Q3Q8FvuX7U3Gm8ds_AlZUKjKWEqq-UIu4FAk6nAPS5suXpVDS4tD6D3oPlxsoolPxTvMxPIDZklnBzniNJrwBFDB1nKUCub-gI7vLtzUso4IxJs54hrPOMD0yc14THGrcT7jLWAcrD4LRDOexP35TSKcHhCsIcCLKLl5-pRuRLNcdZDmLuPF7AFt_fSx5ny0AgbKrVaYQdLHrzV4Jv9YKTm-121PFMdfP2BkEmGO7LUidv-jGnOLkIpfCbQE1v7"
        alt="Smart Infrastructure"
        fill
        className="object-cover scale-105 opacity-60 z-0"
        priority
      />
      <div className="absolute inset-0 image-overlay z-10"></div>
      <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10"></div>

      {/* Brand Header */}
      <div className="absolute top-16 left-16 z-20 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
        <span className="font-headline text-3xl font-bold tracking-tighter text-on-surface">ayresIoT</span>
      </div>

      {/* Atmospheric Branding Text */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-16 left-16 z-20"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-1 bg-primary shadow-[0_0_15px_rgba(26,35,126,0.6)]"></div>
          <span className="font-label text-[10px] tracking-[0.5em] uppercase text-on-surface-variant font-bold">Atmósfera Sintética</span>
        </div>
        <h2 className="font-headline text-6xl font-bold tracking-tight leading-[1.1] max-w-lg text-on-surface">
          El nexo entre el <span className="text-primary-light">espacio</span> y el <span className="italic font-light">control</span>.
        </h2>
      </motion.div>
    </div>
  );
};
