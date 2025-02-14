import { PropsWithChildren } from 'react'

type ModalProps = {
  isOpen: boolean;
  onClose(): void;
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ children, isOpen, onClose }) => {
  return (
    <div tabIndex={-1} aria-hidden='true' className={`${isOpen ? 'flex' : 'hidden'} bg-black/70 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
      <div className='relative p-4 w-full max-w-2xl max-h-full' onClick={(e) => e.stopPropagation()}>
        {/* <!-- Modal content --> */}
        <div className='relative bg-white rounded-lg shadow dark:bg-neutral-800'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal