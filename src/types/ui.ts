export const SelectMenuElementType = {
  Option: 'Option',
  Divider: 'Divider',
  Header: 'Header',
} as const;

export type SelectMenuElementTypeValue = typeof SelectMenuElementType[keyof typeof SelectMenuElementType];

export type SelectMenuElement = 
  | { type: typeof SelectMenuElementType.Option; title: string; value: string }
  | { type: typeof SelectMenuElementType.Divider }
  | { type: typeof SelectMenuElementType.Header; title: string };

export const createSelectHeader = (title: string): SelectMenuElement => {
  return {
    type: SelectMenuElementType.Header,
    title
  };
};

export const createSelectDivider = (): SelectMenuElement => {
  return {
    type: SelectMenuElementType.Divider
  };
};

export const createSelectOption = (title: string, value: string): SelectMenuElement => {
  return {
    type: SelectMenuElementType.Option,
    title,
    value
  };
};
