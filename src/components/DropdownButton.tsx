import React, { useState } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useInteractions,
  useClick,
} from '@floating-ui/react';

interface Props {
  containerClassName?: string;
  label: string;
  options: { label: string; onClick(): void }[]
}

const DropdownButton: React.FC<Props> = ({ label, options, containerClassName = '' }) => {
  const [open, setOpen] = useState(false);

  const {
    refs,
    floatingStyles,
    context,
  } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(4), flip(), shift()],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'menu' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const handleAltAction = (action: { label: string; onClick(): void }) => {
    action.onClick()
    setOpen(false);
  };

  return (
    <div className="inline-flex relative">
      {/* Button */}
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`bg-white/10 text-fantasy-text border border-white/20 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:bg-white/20 ${containerClassName}`}
      >
        {label}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className='absolute z-50 mt-1 flex flex-col w-48 rounded-lg shadow-lg bg-fantasy-medium border border-fantasy-border'
        >
          {options.map((action, index) => (
            <div
              key={index}
              onClick={() => handleAltAction(action)}
              className='text-fantasy-text hover:bg-fantasy-dark rounded-lg px-4 py-2 text-sm font-medium cursor-pointer'
            >
              {action.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
