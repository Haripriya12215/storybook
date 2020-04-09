import 'jest-specific-snapshot';
import { transformSync } from '@babel/core';
import requireFromString from 'require-from-string';
import dedent from 'ts-dedent';
import fs from 'fs';

import { convert } from './convert';
import { normalizeNewlines } from '../utils';

expect.addSnapshotSerializer({
  print: (val: any) => JSON.stringify(val, null, 2),
  test: (val) => typeof val !== 'string',
});

describe('storybook type system', () => {
  describe('TypeScript', () => {
    it('scalars', () => {
      const input = readFixture('typescript/functions.tsx');
      expect(input).toMatchInlineSnapshot(`
        "import React, { FC } from 'react';

        interface ItemInterface {
          text: string;
          value: string;
        }
        interface Props {
          onClick?: () => void;
          voidFunc: () => void;
          funcWithArgsAndReturns: (a: string, b: string) => string;
          funcWithUnionArg: (a: string | number) => string;
          funcWithMultipleUnionReturns: () => string | ItemInterface;
        }
        export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
        "
      `);
      expect(convertTs(input)).toMatchInlineSnapshot(`
        {
          "onClick": {
            "raw": "() => void",
            "name": "function"
          },
          "voidFunc": {
            "raw": "() => void",
            "name": "function"
          },
          "funcWithArgsAndReturns": {
            "raw": "(a: string, b: string) => string",
            "name": "function"
          },
          "funcWithUnionArg": {
            "raw": "(a: string | number) => string",
            "name": "function"
          },
          "funcWithMultipleUnionReturns": {
            "raw": "() => string | ItemInterface",
            "name": "function"
          }
        }
      `);
    });
    it('functions', () => {
      const input = readFixture('typescript/functions.tsx');
      expect(input).toMatchInlineSnapshot(`
        "import React, { FC } from 'react';

        interface ItemInterface {
          text: string;
          value: string;
        }
        interface Props {
          onClick?: () => void;
          voidFunc: () => void;
          funcWithArgsAndReturns: (a: string, b: string) => string;
          funcWithUnionArg: (a: string | number) => string;
          funcWithMultipleUnionReturns: () => string | ItemInterface;
        }
        export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
        "
      `);
      expect(convertTs(input)).toMatchInlineSnapshot(`
        {
          "onClick": {
            "raw": "() => void",
            "name": "function"
          },
          "voidFunc": {
            "raw": "() => void",
            "name": "function"
          },
          "funcWithArgsAndReturns": {
            "raw": "(a: string, b: string) => string",
            "name": "function"
          },
          "funcWithUnionArg": {
            "raw": "(a: string | number) => string",
            "name": "function"
          },
          "funcWithMultipleUnionReturns": {
            "raw": "() => string | ItemInterface",
            "name": "function"
          }
        }
      `);
    });
    it('enums', () => {
      const input = readFixture('typescript/enums.tsx');
      expect(input).toMatchInlineSnapshot(`
        "import React, { FC } from 'react';

        enum DefaultEnum {
          TopLeft,
          TopRight,
          TopCenter,
        }
        enum NumericEnum {
          TopLeft = 0,
          TopRight,
          TopCenter,
        }
        enum StringEnum {
          TopLeft = 'top-left',
          TopRight = 'top-right',
          TopCenter = 'top-center',
        }
        interface Props {
          defaultEnum: DefaultEnum;
          numericEnum: NumericEnum;
          stringEnum: StringEnum;
        }
        export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
        "
      `);
      expect(convertTs(input)).toMatchInlineSnapshot(`
        {
          "defaultEnum": {
            "name": "other",
            "value": "DefaultEnum"
          },
          "numericEnum": {
            "name": "other",
            "value": "NumericEnum"
          },
          "stringEnum": {
            "name": "other",
            "value": "StringEnum"
          }
        }
      `);
    });
    it('unions', () => {
      const input = readFixture('typescript/unions.tsx');
      expect(input).toMatchInlineSnapshot(`
        "import React, { FC } from 'react';

        type Kind = 'default' | 'action';
        enum DefaultEnum {
          TopLeft,
          TopRight,
          TopCenter,
        }
        enum NumericEnum {
          TopLeft = 0,
          TopRight,
          TopCenter,
        }
        type EnumUnion = DefaultEnum | NumericEnum;
        interface Props {
          kind?: Kind;
          inlinedNumericLiteralUnion: 0 | 1;
          enumUnion: EnumUnion;
        }
        export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
        "
      `);
      expect(convertTs(input)).toMatchInlineSnapshot(`
        {
          "kind": {
            "raw": "'default' | 'action'",
            "name": "union",
            "value": [
              {
                "name": "other",
                "value": "literal"
              },
              {
                "name": "other",
                "value": "literal"
              }
            ]
          },
          "inlinedNumericLiteralUnion": {
            "raw": "0 | 1",
            "name": "union",
            "value": [
              {
                "name": "other",
                "value": "literal"
              },
              {
                "name": "other",
                "value": "literal"
              }
            ]
          },
          "enumUnion": {
            "raw": "DefaultEnum | NumericEnum",
            "name": "union",
            "value": [
              {
                "name": "other",
                "value": "DefaultEnum"
              },
              {
                "name": "other",
                "value": "NumericEnum"
              }
            ]
          }
        }
      `);
    });
    it('intersections', () => {
      const input = readFixture('typescript/intersections.tsx');
      expect(input).toMatchInlineSnapshot(`
        "import React, { FC } from 'react';

        interface ItemInterface {
          text: string;
          value: string;
        }
        interface PersonInterface {
          name: string;
        }
        type InterfaceIntersection = ItemInterface & PersonInterface;
        interface Props {
          intersectionType: InterfaceIntersection;
          intersectionWithInlineType: ItemInterface & { inlineValue: string };
        }
        export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
        "
      `);
      expect(convertTs(input)).toMatchInlineSnapshot(`
        {
          "intersectionType": {
            "raw": "ItemInterface & PersonInterface",
            "name": "intersection",
            "value": [
              {
                "name": "other",
                "value": "ItemInterface"
              },
              {
                "name": "other",
                "value": "PersonInterface"
              }
            ]
          },
          "intersectionWithInlineType": {
            "raw": "ItemInterface & { inlineValue: string }",
            "name": "intersection",
            "value": [
              {
                "name": "other",
                "value": "ItemInterface"
              },
              {
                "raw": "{ inlineValue: string }",
                "name": "object",
                "value": {
                  "inlineValue": {
                    "name": "string"
                  }
                }
              }
            ]
          }
        }
      `);
    });
    it('arrays', () => {
      const input = readFixture('typescript/arrays.tsx');
      expect(input).toMatchInlineSnapshot(`
        "import React, { FC } from 'react';

        interface ItemInterface {
          text: string;
          value: string;
        }
        interface Point {
          x: number;
          y: number;
        }
        interface Props {
          arrayOfPoints: Point[];
          arrayOfInlineObjects: { w: number; h: number }[];
          arrayOfPrimitive: string[];
          arrayOfComplexObject: ItemInterface[];
        }
        export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
        "
      `);
      expect(convertTs(input)).toMatchInlineSnapshot(`
        {
          "arrayOfPoints": {
            "raw": "Point[]",
            "name": "array",
            "value": [
              {
                "name": "other",
                "value": "Point"
              }
            ]
          },
          "arrayOfInlineObjects": {
            "raw": "{ w: number; h: number }[]",
            "name": "array",
            "value": [
              {
                "raw": "{ w: number; h: number }",
                "name": "object",
                "value": {
                  "w": {
                    "name": "number"
                  },
                  "h": {
                    "name": "number"
                  }
                }
              }
            ]
          },
          "arrayOfPrimitive": {
            "raw": "string[]",
            "name": "array",
            "value": [
              {
                "name": "string"
              }
            ]
          },
          "arrayOfComplexObject": {
            "raw": "ItemInterface[]",
            "name": "array",
            "value": [
              {
                "name": "other",
                "value": "ItemInterface"
              }
            ]
          }
        }
      `);
    });
    it('interfaces', () => {
      const input = readFixture('typescript/interfaces.tsx');
      expect(input).toMatchInlineSnapshot(`
        "import React, { FC } from 'react';

        interface ItemInterface {
          text: string;
          value: string;
        }
        interface GenericInterface<T> {
          value: T;
        }
        interface Props {
          interface: ItemInterface;
          genericInterface: GenericInterface<string>;
        }
        export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
        "
      `);
      expect(convertTs(input)).toMatchInlineSnapshot(`
        {
          "interface": {
            "name": "other",
            "value": "ItemInterface"
          },
          "genericInterface": {
            "raw": "GenericInterface<string>",
            "name": "other",
            "value": "GenericInterface"
          }
        }
      `);
    });
    it('records', () => {
      const input = readFixture('typescript/records.tsx');
      expect(input).toMatchInlineSnapshot(`
        "import React, { FC } from 'react';

        interface ItemInterface {
          text: string;
          value: string;
        }
        interface Props {
          recordOfPrimitive: Record<string, number>;
          recordOfComplexObject: Record<string, ItemInterface>;
        }
        export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
        "
      `);
      expect(convertTs(input)).toMatchInlineSnapshot(`
        {
          "recordOfPrimitive": {
            "raw": "Record<string, number>",
            "name": "other",
            "value": "Record"
          },
          "recordOfComplexObject": {
            "raw": "Record<string, ItemInterface>",
            "name": "other",
            "value": "Record"
          }
        }
      `);
    });
    it('aliases', () => {
      const input = readFixture('typescript/aliases.tsx');
      expect(input).toMatchInlineSnapshot(`
        "import React, { FC } from 'react';

        type StringAlias = string;
        type NumberAlias = number;
        type AliasesIntersection = StringAlias & NumberAlias;
        type AliasesUnion = StringAlias | NumberAlias;
        type GenericAlias<T> = { value: T };
        interface Props {
          typeAlias: StringAlias;
          aliasesIntersection: AliasesIntersection;
          aliasesUnion: AliasesUnion;
          genericAlias: GenericAlias<string>;
        }
        export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
        "
      `);
      expect(convertTs(input)).toMatchInlineSnapshot(`
        {
          "typeAlias": {
            "name": "string"
          },
          "aliasesIntersection": {
            "raw": "StringAlias & NumberAlias",
            "name": "intersection",
            "value": [
              {
                "name": "string"
              },
              {
                "name": "number"
              }
            ]
          },
          "aliasesUnion": {
            "raw": "StringAlias | NumberAlias",
            "name": "union",
            "value": [
              {
                "name": "string"
              },
              {
                "name": "number"
              }
            ]
          },
          "genericAlias": {
            "raw": "{ value: T }",
            "name": "object",
            "value": {
              "value": {
                "name": "string"
              }
            }
          }
        }
      `);
    });
    it('tuples', () => {
      const input = readFixture('typescript/tuples.tsx');
      expect(input).toMatchInlineSnapshot(`
        "import React, { FC } from 'react';

        interface ItemInterface {
          text: string;
          value: string;
        }
        interface Props {
          tupleOfPrimitive: [string, number];
          tupleWithComplexType: [string, ItemInterface];
        }
        export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
        "
      `);
      expect(convertTs(input)).toMatchInlineSnapshot(`
        {
          "tupleOfPrimitive": {
            "raw": "[string, number]",
            "name": "other",
            "value": "tuple"
          },
          "tupleWithComplexType": {
            "raw": "[string, ItemInterface]",
            "name": "other",
            "value": "tuple"
          }
        }
      `);
    });
  });
  describe('PropTypes', () => {
    it('scalars', () => {
      const input = readFixture('proptypes/scalars.js');
      expect(input).toMatchInlineSnapshot(`
        "import React from 'react';
        import PropTypes from 'prop-types';

        export const Component = (props) => <>JSON.stringify(props)</>;
        Component.propTypes = {
          optionalBool: PropTypes.bool,
          optionalFunc: PropTypes.func,
          optionalNumber: PropTypes.number,
          optionalString: PropTypes.string,
          optionalSymbol: PropTypes.symbol,
        };
        "
      `);
      expect(convertJs(input)).toMatchInlineSnapshot(`
        {
          "optionalBool": {
            "name": "boolean"
          },
          "optionalFunc": {
            "name": "function"
          },
          "optionalNumber": {
            "name": "number"
          },
          "optionalString": {
            "name": "string"
          },
          "optionalSymbol": {
            "name": "symbol"
          }
        }
      `);
    });
    it('arrays', () => {
      const input = readFixture('proptypes/arrays.js');
      expect(input).toMatchInlineSnapshot(`
        "import React from 'react';
        import PropTypes from 'prop-types';

        export const Component = (props) => <>JSON.stringify(props)</>;
        Component.propTypes = {
          optionalArray: PropTypes.array,
          arrayOfStrings: PropTypes.arrayOf(PropTypes.string),
          arrayOfShape: PropTypes.arrayOf(
            PropTypes.shape({
              active: PropTypes.bool,
            })
          ),
        };
        "
      `);
      expect(convertJs(input)).toMatchInlineSnapshot(`
        {
          "optionalArray": {
            "name": "other",
            "value": "array"
          },
          "arrayOfStrings": {
            "name": "array",
            "value": {
              "name": "string"
            }
          },
          "arrayOfShape": {
            "name": "array",
            "value": {
              "name": "object",
              "value": {
                "active": {
                  "name": "boolean"
                }
              }
            }
          }
        }
      `);
    });
    it('enums', () => {
      const input = readFixture('proptypes/enums.js');
      expect(input).toMatchInlineSnapshot(`
        "import React from 'react';
        import PropTypes from 'prop-types';

        export const Component = (props) => <>JSON.stringify(props)</>;
        Component.propTypes = {
          oneOfNumber: PropTypes.oneOf([1, 2, 3]),
          oneOfString: PropTypes.oneOf(['static', 'timed']),
        };
        "
      `);
      expect(convertJs(input)).toMatchInlineSnapshot(`
        {
          "oneOfNumber": {
            "name": "enum",
            "value": [
              "1",
              "2",
              "3"
            ]
          },
          "oneOfString": {
            "name": "enum",
            "value": [
              "'static'",
              "'timed'"
            ]
          }
        }
      `);
    });
    it('misc', () => {
      const input = readFixture('proptypes/misc.js');
      expect(input).toMatchInlineSnapshot(`
        "import React from 'react';
        import PropTypes from 'prop-types';

        export const Component = (props) => <>JSON.stringify(props)</>;
        Component.propTypes = {
          // An object that could be one of many types
          optionalUnion: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.instanceOf(Object),
          ]),
          optionalMessage: PropTypes.instanceOf(Object),
          // A value of any data type
          requiredAny: PropTypes.any.isRequired,
        };
        "
      `);
      expect(convertJs(input)).toMatchInlineSnapshot(`
        {
          "optionalUnion": {
            "name": "union",
            "value": [
              {
                "name": "string"
              },
              {
                "name": "number"
              },
              {
                "name": "other",
                "value": "instanceOf(Object)"
              }
            ]
          },
          "optionalMessage": {
            "name": "other",
            "value": "instanceOf(Object)"
          },
          "requiredAny": {
            "name": "other",
            "value": "any"
          }
        }
      `);
    });
    it('objects', () => {
      const input = readFixture('proptypes/objects.js');
      expect(input).toMatchInlineSnapshot(`
        "import React from 'react';
        import PropTypes from 'prop-types';

        export const Component = (props) => <>JSON.stringify(props)</>;
        Component.propTypes = {
          optionalObject: PropTypes.object,
          optionalObjectOf: PropTypes.objectOf(PropTypes.number),
          optionalObjectWithShape: PropTypes.shape({
            color: PropTypes.string,
            fontSize: PropTypes.number,
          }),
          optionalObjectWithStrictShape: PropTypes.exact({
            name: PropTypes.string,
            quantity: PropTypes.number,
          }),
        };
        "
      `);
      expect(convertJs(input)).toMatchInlineSnapshot(`
        {
          "optionalObject": {
            "name": "object"
          },
          "optionalObjectOf": {
            "name": "objectOf",
            "value": {
              "name": "number"
            }
          },
          "optionalObjectWithShape": {
            "name": "object",
            "value": {
              "color": {
                "name": "string"
              },
              "fontSize": {
                "name": "number"
              }
            }
          },
          "optionalObjectWithStrictShape": {
            "name": "object",
            "value": {
              "name": {
                "name": "string"
              },
              "quantity": {
                "name": "number"
              }
            }
          }
        }
      `);
    });
    it('react', () => {
      const input = readFixture('proptypes/react.js');
      expect(input).toMatchInlineSnapshot(`
        "import React from 'react';
        import PropTypes from 'prop-types';

        export const Component = (props) => <>JSON.stringify(props)</>;
        Component.propTypes = {
          // Anything that can be rendered: numbers, strings, elements or an array
          // (or fragment) containing these types.
          optionalNode: PropTypes.node,
          // A React element.
          optionalElement: PropTypes.element,
          // A React element type (ie. MyComponent).
          optionalElementType: PropTypes.elementType,
        };
        "
      `);
      expect(convertJs(input)).toMatchInlineSnapshot(`
        {
          "optionalNode": {
            "name": "other",
            "value": "node"
          },
          "optionalElement": {
            "name": "other",
            "value": "element"
          },
          "optionalElementType": {
            "name": "other",
            "value": "elementType"
          }
        }
      `);
    });
  });
});

const readFixture = (fixture: string) =>
  fs.readFileSync(`${__dirname}/__testfixtures__/${fixture}`).toString();

const transformToModule = (inputCode: string) => {
  const options = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            esmodules: true,
          },
        },
      ],
    ],
  };
  const { code } = transformSync(inputCode, options);
  return normalizeNewlines(code);
};

const annotateWithDocgen = (inputCode: string, filename: string) => {
  const options = {
    presets: ['@babel/typescript', '@babel/react'],
    plugins: ['babel-plugin-react-docgen', '@babel/plugin-proposal-class-properties'],
    babelrc: false,
    filename,
  };
  const { code } = transformSync(inputCode, options);
  return normalizeNewlines(code);
};

const convertCommon = (code: string, fileExt: string) => {
  const docgenPretty = annotateWithDocgen(code, `temp.${fileExt}`);
  const { Component } = requireFromString(transformToModule(docgenPretty));
  // eslint-disable-next-line no-underscore-dangle
  const { props = {} } = Component.__docgenInfo || {};
  const types = Object.keys(props).reduce((acc: Record<string, any>, key) => {
    acc[key] = convert(props[key]);
    return acc;
  }, {});
  return types;
};

const convertTs = (code: string) => {
  // const code = dedent`
  //   import React, { FC } from 'react';
  //   ${propsInterface}
  //   export const Component: FC<Props> = (props: Props) => <>JSON.stringify(props)</>;
  // `;
  return convertCommon(code, 'tsx');
};

const convertJs = (code: string) => {
  // const code = dedent`
  //   import React from 'react';
  //   import PropTypes from 'prop-types';

  //   export const Component = props => <>JSON.stringify(props)</>;
  //   Component.propTypes = ${propTypes};
  // `;
  return convertCommon(code, 'js');
};
