import type { NodePath } from '@babel/traverse';
import type {
  ExportAllDeclaration,
  ExportNamedDeclaration,
  ImportDeclaration,
} from '@babel/types';
import type FileState from '../FileState';
import makeIgnoreImports from './makeIgnoreImports';
import makeFsImporter from './makeFsImporter';

export type ImportPath = NodePath<
  ExportAllDeclaration | ExportNamedDeclaration | ImportDeclaration
>;

export type Importer = (
  path: ImportPath,
  name: string,
  file: FileState,
) => NodePath | null;

export { makeIgnoreImports, makeFsImporter };
