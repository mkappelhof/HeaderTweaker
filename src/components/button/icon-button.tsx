import { cloneElement, type ElementType, isValidElement, memo, type ReactElement } from 'react';
import classnames from 'clsx';
import { Button, type ButtonProps } from './button';

import css from './button.module.scss';

type IconSizeProps = {
  width?: number;
  height?: number;
};

export type IconButtonProps<
  P extends IconSizeProps = IconSizeProps,
  T extends ElementType = ElementType,
> = Omit<ButtonProps, 'children'> & {
  children: ReactElement<P, T>;
  size?: 'normal' | 'large';
};

const IconButtonComponent = <
  P extends IconSizeProps = IconSizeProps,
  T extends ElementType = ElementType,
>({
  children,
  size = 'normal',
  ...props
}: IconButtonProps<P, T>) => {
  if (!isValidElement(children)) {
    return null;
  }

  const { width: defaultWidth, height: defaultHeight }: IconSizeProps = { width: 20, height: 20 };

  return (
    <Button
      className={classnames(css.iconButton, {
        [css.iconButtonLarge]: size === 'large',
      })}
      {...props}
    >
      {cloneElement(children, {
        ...children.props,
        width: children.props.width ?? defaultWidth,
        height: children.props.height ?? defaultHeight,
      })}
    </Button>
  );
};

export const IconButton = memo(IconButtonComponent);
