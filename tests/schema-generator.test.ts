import { generateSchema } from '../src/db/schemaGenerator';

describe('Schema Generator', () => {
  test('generates postgres SQL schema', async () => {
    const result = await generateSchema('postgresql', 'node');
    expect(result['migrations/001_init.sql']).toBeDefined();
    expect(result['migrations/001_init.sql']).toContain('CREATE TABLE');
    expect(result['prisma/schema.prisma']).toBeDefined();
  });

  test('generates mysql schema', async () => {
    const result = await generateSchema('mysql', 'node');
    expect(result['migrations/001_init.sql']).toBeDefined();
    expect(result['migrations/001_init.sql']).toContain('CREATE TABLE');
    expect(result['prisma/schema.prisma']).toBeDefined();
  });

  test('generates sqlite schema', async () => {
    const result = await generateSchema('sqlite', 'node');
    expect(result['migrations/001_init.sql']).toBeDefined();
    expect(result['migrations/001_init.sql']).toContain('CREATE TABLE');
  });

  test('generates mongodb models for node', async () => {
    const result = await generateSchema('mongodb', 'node');
    expect(result['models/index.ts']).toBeDefined();
    expect(result['models/index.ts']).toContain('mongoose');
  });

  test('generates mongodb models for python', async () => {
    const result = await generateSchema('mongodb', 'python');
    expect(result['models.py']).toBeDefined();
    expect(result['models.py']).toContain('mongoengine');
  });

  test('returns empty object for no database', async () => {
    const result = await generateSchema(undefined, 'node');
    expect(Object.keys(result).length).toBe(0);
  });

  test('includes User and Session tables', async () => {
    const result = await generateSchema('postgresql', 'node');
    const sql = result['migrations/001_init.sql'];
    expect(sql).toContain('user');
    expect(sql).toContain('session');
  });
});
