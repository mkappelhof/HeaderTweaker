import { cloneElement, type ElementType, isValidElement, type ReactElement } from 'react';
import { Button, type ButtonProps } from './button';

import css from './button.module.scss';

type IconSizeProps = {
  width?: number;
  height?: number;
};

type ChildrenWithSizeProps<
  P extends IconSizeProps = IconSizeProps,
  T extends ElementType = ElementType,
> = Omit<ButtonProps, 'children'> & {
  children: ReactElement<P, T>;
};

export const IconButton = <
  P extends IconSizeProps = IconSizeProps,
  T extends ElementType = ElementType,
>({
  children,
  ...props
}: ChildrenWithSizeProps<P, T>) => {
  if (!isValidElement(children)) {
    return null;
  }

  const { width: defaultWidth, height: defaultHeight }: IconSizeProps = { width: 20, height: 20 };

  return (
    <Button className={css.iconButton} {...props}>
      {cloneElement(children, {
        ...children.props,
        width: children.props.width ?? defaultWidth,
        height: children.props.height ?? defaultHeight,
      })}
    </Button>
  );
};
