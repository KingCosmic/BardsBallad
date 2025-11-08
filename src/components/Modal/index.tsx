import { PropsWithChildren } from 'react'

type ModalProps = {
  isOpen: boolean;
  onClose?(): void;

  className?: string
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ children, isOpen, onClose, className = '' }) => {
  return (
    <div tabIndex={-1} aria-hidden='true'
      className={`${isOpen ? 'flex' : 'hidden'} bg-black/70 absolute top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-screen max-h-screen`}
      onClick={onClose}
    >
      <div className='relative min-w-[32rem] max-w-2xl' onClick={(e) => e.stopPropagation()}>
        {/* <!-- Modal content --> */}
        <div className={`relative rounded-lg shadow bg-fantasy-light border border-fantasy-border ${className}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal