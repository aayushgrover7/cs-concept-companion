import type { ConceptEntry } from './entry';
import { programmingConcepts } from './programming';
import { dataStructureConcepts } from './dataStructures';
import { systemsConcepts } from './systems';
import { dataAndSecurityConcepts } from './dataAndSecurity';

export type { ConceptEntry } from './entry';

export const allConcepts: ConceptEntry[] = [
  ...programmingConcepts,
  ...dataStructureConcepts,
  ...systemsConcepts,
  ...dataAndSecurityConcepts,
];
