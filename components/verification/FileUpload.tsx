"use client"

import { Upload, CheckCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface FileUploadProps {
  file: File | null
  onFileSelect: (file: File) => void
}

export default function FileUpload({ file, onFileSelect }: FileUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(selectedFile.type)) {
        toast.error('Only JPEG, PNG, and PDF files are allowed')
        return
      }
      onFileSelect(selectedFile)
      toast.success('File uploaded successfully')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 border-gray-300 dark:border-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {file ? (
            <>
              <CheckCircle className="w-10 h-10 mb-3 text-green-500" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                {file.name}
              </p>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF, PNG, or JPG (MAX. 5MB)
              </p>
            </>
          )}
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
        />
      </Label>
    </div>
  )
}