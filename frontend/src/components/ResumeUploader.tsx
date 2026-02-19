'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadResume } from '@/lib/apiClient';
import { Card } from '@/components/ui/card';

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
      }, 1000);
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
    <Card className="p-0 border-0 bg-transparent shadow-none w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          {...getRootProps()}
          className={`
            relative overflow-hidden rounded-3xl p-12 text-center cursor-pointer
            border border-white/10
            backdrop-blur-xl bg-white/5
            transition-all duration-500 ease-out
            group
            ${isDragActive ? 'border-primary/50 bg-primary/10 ring-2 ring-primary/20 scale-[1.02]' : 'hover:border-white/20 hover:bg-white/10'}
          `}
        >
          {/* Subtle Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <input {...getInputProps()} />

          <div className="relative z-10 flex flex-col items-center justify-center min-h-[200px]">
            {uploading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary" />
                  <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" size={28} />
                </div>
                <p className="text-xl font-medium text-white mb-2">Analyzing Profile...</p>
                <p className="text-sm text-white/50">{fileName}</p>
              </motion.div>
            ) : uploadStatus === 'success' ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <CheckCircle className="text-green-400" size={40} />
                </div>
                <p className="text-xl font-medium text-white">Success!</p>
              </motion.div>
            ) : uploadStatus === 'error' ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                  <XCircle className="text-red-400" size={40} />
                </div>
                <p className="text-xl font-medium text-white mb-2">Upload Failed</p>
                <p className="text-sm text-white/50">Please try again</p>
              </motion.div>
            ) : (
              <motion.div
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Upload className="text-white group-hover:text-primary transition-colors duration-300" size={40} />
                </div>

                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
                  Upload Resume
                </h3>

                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/70 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                  <span className="text-sm font-medium">Click to Browse or Drag File</span>
                  <ArrowRight size={16} />
                </div>

                <p className="mt-8 text-xs text-white/30 uppercase tracking-widest font-medium">
                  PDF Format Only • Max 10MB
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </Card>
  );
}
