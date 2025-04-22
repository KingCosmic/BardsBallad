import { useState } from 'react';

type FileUploadProps = {
  id: string;
  label: string;
  onChange(value: string): void
}

const FileUpload: React.FC<FileUploadProps> = ({ id, label, onChange }) => {
  const [selectedFile, setSelectedFile] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setSelectedFile(file.name)
        onChange(content)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div>
      <label htmlFor={id} className='block mb-2 text-sm font-medium text-neutral-900 dark:text-white'>{`${label} - ${selectedFile ?? 'none'}`}</label>
      <input type='file' id='file-upload' name='file-name' onChange={handleFileChange} />
    </div>
  )
}

export default FileUpload