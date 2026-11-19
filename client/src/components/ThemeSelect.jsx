import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Enterprise Themed Select / Dropdown
 * Executive Deep Emerald & Gold themed dropdown.
 */
export default function ThemeSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select option...',
  variant = 'form', // 'pill' | 'form' | 'admin' | 'compact'
  className = '',
  menuClassName = '',
  align = 'left',
  disabled = false,
  fullWidth,
  id,
  name
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const isFullWidth = fullWidth !== undefined ? fullWidth : (variant === 'form' || variant === 'admin');

  // Normalize options into { value, label } objects
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value !== undefined ? opt.value : opt.id,
        label: opt.label !== undefined ? opt.label : opt.name || String(opt.value),
        badge: opt.badge
      };
    }
    return { value: opt, label: String(opt) };
  });

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Variant styling
  const variantStyles = {
    pill: {
      button:
        'bg-white border border-[#D4A24C]/35 text-[#0D3B2A] rounded-full px-3.5 py-1.5 text-xs font-semibold hover:border-[#D4A24C] shadow-xs inline-flex items-center gap-2 justify-between cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#D4A24C]',
      menu: 'min-w-[195px] rounded-2xl border border-[#D4A24C]/35 bg-white shadow-2xl shadow-[#0D3B2A]/15 p-1.5 backdrop-blur-md space-y-0.5',
      item: 'px-3 py-2 text-xs font-medium rounded-xl'
    },
    compact: {
      button:
        'bg-white border border-[#D4A24C]/35 text-[#0D3B2A] rounded-xl px-2.5 py-1 text-xs font-semibold hover:border-[#D4A24C] shadow-xs inline-flex items-center gap-1.5 justify-between cursor-pointer focus:outline-none',
      menu: 'min-w-[165px] rounded-xl border border-[#D4A24C]/35 bg-white shadow-xl shadow-[#0D3B2A]/10 p-1 backdrop-blur-md space-y-0.5',
      item: 'px-2.5 py-1.5 text-xs font-medium rounded-lg'
    },
    form: {
      button:
        'w-full bg-[#FAF7F2] border border-[#D4A24C]/35 text-[#0D3B2A] rounded-xl px-3.5 py-2.5 text-sm font-medium hover:border-[#0D3B2A] shadow-xs flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]',
      menu: 'w-full rounded-2xl border border-[#D4A24C]/35 bg-white shadow-2xl shadow-[#0D3B2A]/12 p-1.5 max-h-64 overflow-y-auto space-y-0.5',
      item: 'px-3.5 py-2 text-sm font-medium rounded-xl'
    },
    admin: {
      button:
        'w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold hover:border-[#0D3B2A] shadow-xs flex items-center justify-between gap-2 cursor-pointer focus:outline-none focus:border-[#0D3B2A] min-w-0',
      menu: 'min-w-[180px] w-full rounded-xl border border-[#D4A24C]/35 bg-white shadow-xl shadow-[#0D3B2A]/10 p-1.5 max-h-60 overflow-y-auto space-y-0.5',
      item: 'px-3 py-2 text-xs font-medium rounded-lg'
    }
  };

  const style = variantStyles[variant] || variantStyles.form;

  const handleSelect = (optValue) => {
    if (disabled) return;
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative min-w-0 ${isFullWidth ? 'w-full block' : 'inline-block'}`}
      id={id}
    >
      {/* Hidden input for HTML form accessibility/submission if name provided */}
      {name && <input type="hidden" name={name} value={value || ''} />}

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`${style.button} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        <span className="truncate min-w-0 block text-left" title={selectedOption ? selectedOption.label : placeholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#D4A24C] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Themed Menu */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className={`absolute z-50 mt-1.5 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${style.menu} ${menuClassName} animate-in fade-in zoom-in-95 duration-100`}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={String(opt.value)}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`${style.item} flex items-center justify-between gap-2 cursor-pointer transition select-none ${
                  isSelected
                    ? 'bg-[#0D3B2A] text-[#FAF7F2] font-semibold shadow-xs'
                    : 'text-[#0D3B2A] hover:bg-[#FAF7F2] hover:text-[#8A5E12]'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="truncate">{opt.label}</span>
                  {opt.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/20 text-[#FAF7F2]'
                          : 'bg-[#D4A24C]/20 text-[#0D3B2A]'
                      }`}
                    >
                      {opt.badge}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#D4A24C] shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
