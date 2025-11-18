import { PropsWithChildren } from 'react'

type ModalProps = {
  isOpen?: boolean;
  onClose?(): void;

  className?: string
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ children, isOpen, onClose, className = '' }) => {
  return (
    <div tabIndex={-1} aria-hidden='true'
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6`}
      onClick={onClose}
    >
      <div className='relative w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[calc(100vh-4rem)] h-full' onClick={(e) => e.stopPropagation()}>
        {/* Modal content: make it a column so header/body/footer layout can scroll the body */}
        <div className={`relative rounded-lg shadow bg-fantasy-light border border-fantasy-border flex flex-col h-full max-h-[calc(100vh-4rem)] overflow-hidden ${className}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal