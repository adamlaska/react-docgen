import type { NodePath } from '@babel/traverse';
import type {
  ClassMethod,
  ClassProperty,
  Expression,
  ObjectMethod,
  ObjectProperty,
  ObjectTypeProperty,
  ObjectTypeSpreadProperty,
  SpreadElement,
  TSMethodSignature,
  TSPropertySignature,
} from '@babel/types';
import getNameOrValue from './getNameOrValue';
import resolveToValue from './resolveToValue';

export const COMPUTED_PREFIX = '@computed#';

/**
 * In an ObjectExpression, the name of a property can either be an identifier
 * or a literal (or dynamic, but we don't support those). This function simply
 * returns the value of the literal or name of the identifier.
 */
export default function getPropertyName(
  propertyPath: NodePath<
    | ClassMethod
    | ClassProperty
    | ObjectMethod
    | ObjectProperty
    | ObjectTypeProperty
    | ObjectTypeSpreadProperty
    | SpreadElement
    | TSMethodSignature
    | TSPropertySignature
  >,
): string | null {
  if (propertyPath.isObjectTypeSpreadProperty()) {
    const argument = propertyPath.get('argument');

    if (argument.isGenericTypeAnnotation()) {
      return getNameOrValue(argument.get('id')) as string;
    }

    return null;
  } else if (propertyPath.has('computed')) {
    const key = propertyPath.get('key') as NodePath<Expression>;

    // Try to resolve variables and member expressions
    if (key.isIdentifier() || key.isMemberExpression()) {
      const valuePath = resolveToValue(key);

      if (valuePath.isStringLiteral() || valuePath.isNumericLiteral()) {
        return `${valuePath.node.value}`;
      }
    }

    // generate name for identifier
    if (key.isIdentifier()) {
      return `${COMPUTED_PREFIX}${key.node.name}`;
    }

    if (key.isStringLiteral() || key.isNumericLiteral()) {
      return `${key.node.value}`;
    }

    return null;
  }

  return `${getNameOrValue(propertyPath.get('key') as NodePath)}`;
}
