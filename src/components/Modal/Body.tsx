import { PropsWithChildren } from 'react'

type ModalBodyProps = {
  className?: string;
}

const ModalBody: React.FC<PropsWithChildren<ModalBodyProps>> = ({ children, className = '' }) => {
  // default: padding + vertical spacing, and allow the body to grow and scroll inside the modal
  return (
    <div className={className || `p-4 md:p-5 space-y-4 flex-1 overflow-auto` }>
      {children}
    </div>
  )
}

export default ModalBody