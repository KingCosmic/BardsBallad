import React, { useState, useRef, useEffect } from 'react';
import { useFloating, autoUpdate, offset, flip, shift, size } from '@floating-ui/react';
import { ChevronDown, X, Check } from 'lucide-react';

interface Props {
  options: { value: any, label: string }[]
  value: any[];
  onChange(val:any[]): void;
  placeholder?: string;
  searchable?: boolean;
  maxHeight?: number;
  className?: string; 
}

const MultiSelect: React.FC<Props> = ({ 
  options = [], 
  value = [], 
  onChange = () => {}, 
  placeholder = "Select options...",
  searchable = true,
  maxHeight = 200,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${Math.max(rects.reference.width, 200)}px`,
            maxHeight: `${maxHeight}px`
          });
        }
      })
    ],
    whileElementsMounted: autoUpdate
  });

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle option selection
  const handleOptionClick = (option: { value: any, label: string }) => {
    const newValue = value.includes(option.value)
      ? value.filter(v => v !== option.value)
      : [...value, option.value];
    onChange(newValue);
  };

  // Handle remove selected item
  const handleRemoveItem = (valueToRemove: { value: any, label: string }, e: any) => {
    e.stopPropagation();
    const newValue = value.filter(v => v !== valueToRemove);
    onChange(newValue);
  };

  // Get selected option labels
  const getSelectedLabels = () => {
    return options
      .filter(option => value.includes(option.value))
      .map(option => option.label);
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      // @ts-ignore
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (refs.floating.current && !refs.floating.current.contains(event.target) &&
          refs.domReference.current && !refs.domReference.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, refs]);

  const selectedLabels = getSelectedLabels();

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <div
        ref={refs.setReference}
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[40px] px-3 py-2 border border-fantasy-border rounded-md bg-fantasy-dark cursor-pointer hover:border-fantasy-border/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 flex flex-wrap gap-1">
            {selectedLabels.length === 0 ? (
              <span className="text-fantasy-text-muted">{placeholder}</span>
            ) : (
              selectedLabels.map((label, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-fantasy-accent/40 text-fantasy-text rounded text-sm"
                >
                  {label}
                  <button
                    onClick={(e) => {
                      const option = options.find(opt => opt.label === label);
                      if (option) handleRemoveItem(option.value, e);
                    }}
                    className="hover:bg-fantasy-accent-dark rounded-full p-0.5 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown 
            size={20} 
            className={`text-fantasy-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-50 bg-fantasy-dark border border-fantasy-border rounded-md shadow-lg overflow-hidden"
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-fantasy-border">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full px-2 py-1 border border-fantasy-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-fantasy-accent"
              />
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto" style={{ maxHeight: maxHeight - (searchable ? 50 : 0) }}>
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-fantasy-text-muted text-sm">
                {searchTerm ? 'No options found' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    className={`px-3 py-2 cursor-pointer hover:bg-fantasy-light flex items-center gap-2 ${
                      isSelected ? 'bg-fantasy-glass' : ''
                    }`}
                  >
                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                      isSelected ? 'bg-fantasy-accent border-fantasy-border' : 'border-fantasy-border'
                    }`}>
                      {isSelected && <Check size={12} className='text-fantasy-text' />}
                    </div>
                    <span className={`text-sm ${isSelected ? 'text-fantasy-accent-dark font-medium' : 'text-fantasy-text'}`}>
                      {option.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;