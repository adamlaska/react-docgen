import type { NodePath } from '@babel/traverse';
import type { CallExpression } from '@babel/types';
import isReactBuiltinReference from './isReactBuiltinReference.js';

/**
 * Returns true if the expression is a function call of the form
 * `React.Children.only(...)` or `React.Children.map(...)`.
 */
export default function isReactChildrenElementCall(
  path: NodePath,
): path is NodePath<CallExpression & { __reactBuiltinTypeHint: true }> {
  if (!path.isCallExpression()) {
    return false;
  }

  const callee = path.get('callee');

  if (callee.isMemberExpression()) {
    const calleeProperty = callee.get('property');

    if (
      calleeProperty.isIdentifier({ name: 'only' }) ||
      calleeProperty.isIdentifier({ name: 'map' })
    ) {
      return isReactBuiltinReference(callee.get('object'), 'Children');
    }
  }

  return false;
}
