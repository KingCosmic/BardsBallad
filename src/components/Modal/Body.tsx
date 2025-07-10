import { PropsWithChildren } from 'react'

type ModalBodyProps = {
  className?: string;
}

const ModalBody: React.FC<PropsWithChildren<ModalBodyProps>> = ({ children, className = '' }) => {
  return (
    <div className={className || `p-4 md:p-5 space-y-4 max-h-96 overflow-y-auto`}>
      {children}
    </div>
  )
}

export default ModalBody