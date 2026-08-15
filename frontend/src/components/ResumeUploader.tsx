'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadResume } from '@/lib/apiClient';
import Stamp from './logbook/Stamp';
import Tape from './logbook/Tape';

interface ResumeUploaderProps {
  onUploadComplete: (data: any) => void;
}

export default function ResumeUploader({ onUploadComplete }: ResumeUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setUploadStatus('idle');

    try {
      const result = await uploadResume(file);
      setUploadStatus('success');
      setTimeout(() => {
        onUploadComplete(result);
      }, 1200);
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
    disabled: uploading,
  });

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <Tape className="-top-3 left-12" angle={-4} />
      <Tape className="-top-3 right-12" angle={5} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-2 border-ink bg-paper-2 shadow-[8px_10px_0_-3px_hsl(var(--ink))]"
      >
        {/* Receipt header */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-ink/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center bg-ink font-serif text-xs font-black text-paper-2">
              R
            </span>
            <div>
              <p className="font-serif text-lg font-bold leading-tight text-ink">
                The Receipt
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-2">
                attach your résumé
              </p>
            </div>
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-ink-2 sm:block">
            No. ______ · pdf
          </span>
        </div>

        <div
          {...getRootProps()}
          className={`group relative cursor-pointer px-8 py-14 text-center transition-all duration-300 sm:px-12 ${
            isDragActive
              ? 'bg-stamp/10'
              : uploadStatus === 'error'
                ? 'bg-stamp/5'
                : 'hover:bg-paper'
          }`}
        >
          <input {...getInputProps()} />

          {/* Perforation line */}
          <div className="pointer-events-none absolute inset-x-4 top-1/2 hidden h-px border-t border-dashed border-ink/20 sm:block" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink/30 bg-paper-2 sm:block" />

          <AnimatePresence mode="wait">
            {uploading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <div className="h-20 w-20 animate-spin rounded-full border-2 border-ink/20 border-t-stamp" />
                  <FileText className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-ink" />
                </div>
                <p className="font-serif text-2xl font-bold text-ink">
                  Parsing the fine print<span className="blink-cursor" />
                </p>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
                  {fileName}
                </p>
              </motion.div>
            ) : uploadStatus === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center border-2 border-ink bg-paper-2 shadow-[4px_4px_0_0_hsl(var(--ink))]">
                  <FileText className="h-8 w-8 text-stamp" />
                </div>
                <p className="font-serif text-3xl font-bold text-ink">
                  Your dossier has been opened.
                </p>
                <Stamp tone="red" animate className="mt-6">
                  Received
                </Stamp>
              </motion.div>
            ) : uploadStatus === 'error' ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 flex flex-col items-center"
              >
                <p className="font-serif text-2xl font-bold text-ink">
                  We couldn&apos;t read that page.
                </p>
                <p className="mt-1 text-sm text-ink-2">
                  Please try again — or check the file is a valid PDF under 10 MB.
                </p>
                <Stamp tone="red" animate className="mt-6">
                  Return to sender
                </Stamp>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="mb-7 flex h-24 w-24 items-center justify-center border-2 border-dashed border-ink/40 bg-paper transition-all duration-300 group-hover:border-stamp group-hover:shadow-[4px_4px_0_0_hsl(var(--stamp))]">
                  <Upload className="h-9 w-9 text-ink transition-colors group-hover:text-stamp" strokeWidth={1.6} />
                </div>

                <h3 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Drop your résumé here
                </h3>
                <p className="mt-3 max-w-sm text-ink-2">
                  or click to browse. We read it once, file it, and never lend
                  it out.
                </p>

                <div className="btn-hard mt-7 inline-flex items-center gap-2 bg-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper-2">
                  Choose file
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>

                <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">
                  pdf only · max 10mb
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
