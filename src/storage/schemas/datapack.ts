import { z } from 'zod';
import { dataTypeSchema, systemTypeSchema } from './system';

const datapackSchema = z.object({
  types: z.array(systemTypeSchema),
  typeHashes: z.array(z.object({
    name: z.string(),
    hash: z.string()
  })),
  packData: z.array(dataTypeSchema)
})

export type DataPack = z.infer<typeof datapackSchema>;

export default datapackSchema