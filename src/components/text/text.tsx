import type { ComponentPropsWithoutRef, FC, HTMLElementType, ReactNode } from 'react';

export const TextVariant = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  BODY: 'body',
  BODY_SMALL: 'body-small',
} as const;

type TextVariant = (typeof TextVariant)[keyof typeof TextVariant];

const VariantTags: { [key in TextVariant]: HTMLElementType } = {
  [TextVariant.H1]: 'h1',
  [TextVariant.H2]: 'h2',
  [TextVariant.H3]: 'h3',
  [TextVariant.BODY]: 'p',
  [TextVariant.BODY_SMALL]: 'small',
};

type TextProps = ComponentPropsWithoutRef<'span'> & {
  children: ReactNode;
  variant?: TextVariant;
  as?: HTMLElementType;
};

export const Text: FC<TextProps> = ({
  children,
  variant = TextVariant.BODY,
  as: Tag = VariantTags[variant],
  ...props
}: TextProps) => {
  return <Tag {...props}>{children}</Tag>;
};
