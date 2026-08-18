import {
  type FC,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { IconButton } from '@components/button/icon-button';
import { TextInput } from '@components/input/text-input';
import { Text } from '@components/text/text';
import { SELECT_CREATE_VALUE } from '@constants/select';
import { ChevronDownIcon, ListBulletIcon } from '@heroicons/react/24/solid';
import classnames from 'clsx';
import { useTranslation } from 'react-i18next';

import css from './select.module.scss';

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = {
  value: string;
  options: SelectOption[];
  allowCreate?: boolean;
  autoFocus?: boolean;
  className?: string;
  createLabel?: string;
  createPlaceholder?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  onInputKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export const Select: FC<SelectProps> = ({
  value,
  options,
  allowCreate = false,
  autoFocus = false,
  className,
  createLabel,
  createPlaceholder,
  disabled = false,
  placeholder,
  onChange,
  onInputKeyDown,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const createLabelText = createLabel ?? t('select.create');
  const placeholderText = placeholder ?? t('select.placeholder');
  const isCustomValue = Boolean(value) && !options.some((option) => option.value === value);
  const showInput = allowCreate && (isCreating || isCustomValue || options.length === 0);
  const selectedOption = options.find((option) => option.value === value);
  const items: SelectOption[] = allowCreate
    ? [...options, { label: createLabelText, value: SELECT_CREATE_VALUE }]
    : options;

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: globalThis.MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [isOpen]);

  const selectItem = (item: SelectOption) => {
    setIsOpen(false);

    if (item.value === SELECT_CREATE_VALUE) {
      setIsCreating(true);
      return;
    }

    setIsCreating(false);
    onChange(item.value);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }

        const offset = event.key === 'ArrowDown' ? 1 : -1;
        setActiveIndex((index) => (index + offset + items.length) % items.length);
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }

        const item = items[activeIndex];
        if (item) selectItem(item);
        break;
      }
      default:
        break;
    }
  };

  if (showInput) {
    return (
      <div ref={rootRef} className={classnames(css.root, css.inputRow, className)}>
        <TextInput
          value={value}
          disabled={disabled}
          placeholder={createPlaceholder ?? placeholderText}
          autoFocus={autoFocus}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onInputKeyDown}
        />
        {options.length > 0 && (
          <IconButton
            aria-label={t('select.chooseExisting')}
            disabled={disabled}
            onClick={() => {
              setIsCreating(false);
              onChange('');
            }}
          >
            <ListBulletIcon />
          </IconButton>
        )}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={classnames(css.root, className)}>
      <button
        type="button"
        className={css.trigger}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleTriggerKeyDown}
      >
        <Text as="span" className={classnames(css.value, { [css.placeholder]: !selectedOption })}>
          {selectedOption?.label ?? placeholderText}
        </Text>
        <ChevronDownIcon className={classnames(css.chevron, { [css.chevronOpen]: isOpen })} />
      </button>

      {isOpen && (
        <div className={css.menu} id={listboxId} role="listbox">
          {items.map((item, index) => {
            const isCreateItem = item.value === SELECT_CREATE_VALUE;

            return (
              <button
                key={item.value}
                type="button"
                role="option"
                aria-selected={item.value === value}
                className={classnames(css.option, {
                  [css.active]: index === activeIndex,
                  [css.create]: isCreateItem,
                  [css.selected]: !isCreateItem && item.value === value,
                })}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  selectItem(item);
                }}
              >
                <Text as="span">{item.label}</Text>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
