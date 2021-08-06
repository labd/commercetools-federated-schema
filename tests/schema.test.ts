import { createCommercetoolsSchema } from '../src/index';

describe('Schema creation', () => {
  test('create default schema', async () => {
    const schema = createCommercetoolsSchema({
      endpoint: 'https://localhost/foobar/graphql',
    });
    expect(schema).toBeDefined()
  });
});
