type BaseCssUnitType = { [propertyName: string]: number };
type CssUnitTypeOrMediaQuery<CssUnitType> =
  | CssUnitType
  | { [mediaQuery: string]: CssUnitTypeOrMediaQuery<CssUnitType> };

const flatMediaQuery = <CssUnitType extends BaseCssUnitType>(
  mediaQuery: string,
  mediaQueryObject: CssUnitTypeOrMediaQuery<CssUnitType>
): [string, CssUnitType] => {
  if (typeof mediaQueryObject === 'object') {
    const nestedKey = Object.keys(mediaQueryObject)[0];
    if (nestedKey.includes('@media')) {
      const [nestedMediaQuery, nestedCssObject] = flatMediaQuery(
        nestedKey,
        mediaQueryObject[nestedKey] as CssUnitTypeOrMediaQuery<CssUnitType>
      );
      return [
        (mediaQuery + ' ' + nestedMediaQuery).replace(') @media (', ') and ('),
        nestedCssObject,
      ];
    }
  }
  return [mediaQuery, mediaQueryObject as CssUnitType];
};

const mediaQueryObjectToCss = <CssUnitType extends BaseCssUnitType>(
  mediaQueryObject: CssUnitTypeOrMediaQuery<CssUnitType>,
  cssObjectToString: (cssObject: CssUnitType) => string
): string =>
  (
    Object.entries(mediaQueryObject) as Array<
      [string, number | CssUnitTypeOrMediaQuery<CssUnitType>]
    >
  )
    .map(([key, value]): string => {
      let mediaQuery;
      let cssUnit: CssUnitType;
      if (typeof value !== 'number') {
        // key.includes('@media')
        [mediaQuery, cssUnit] = flatMediaQuery<CssUnitType>(key, value);
      } else {
        cssUnit = { [key]: value } as CssUnitType;
      }
      const rule = cssObjectToString(cssUnit);
      if (!mediaQuery) {
        return rule;
      }
      return `${mediaQuery} { ${rule} }`;
    })
    .join('\n');

export default mediaQueryObjectToCss;
