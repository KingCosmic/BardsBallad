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
import { ChevronDown } from 'lucide-react'; // Optional, or use any icon library

interface Props {
  containerClassName?: string;
  label: string;
  options: { label: string; onClick(): void }[]
  onClick(): void
}

const ButtonWithDropdown: React.FC<Props> = ({ label, options, onClick, containerClassName = '' }) => {
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

  const handleMainAction = () => {
    onClick()
  };

  const handleAltAction = (action: { label: string; onClick(): void }) => {
    action.onClick()
    setOpen(false);
  };

  return (
    <div className="inline-flex relative">
      {/* Main Action Button */}
      <button
        onClick={handleMainAction}
        className={`px-4 py-2 bg-white/10 text-fantasy-text border border-white/60 rounded-l-lg text-xs font-medium transition-all duration-300 hover:bg-white/20 ${containerClassName}`}
      >
        {label}
      </button>

      {/* Dropdown Toggle */}
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className="px-2 py-2 bg-white/10 text-fantasy-text rounded-r-lg border border-white/20 text-xs font-medium transition-all duration-300 hover:bg-white/20"
      >
        <ChevronDown size={16} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="absolute z-50 mt-1 flex flex-col w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {options.map((action, index) => (
            <div
              key={index}
              onClick={() => handleAltAction(action)}
              className="bg-neutral-50 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer"
            >
              {action.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ButtonWithDropdown;