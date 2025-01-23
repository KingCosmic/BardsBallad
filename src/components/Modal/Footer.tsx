import { PropsWithChildren } from 'react'

const ModalFooter: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600'>
      {children}
    </div>
  )
}

export default ModalFooter