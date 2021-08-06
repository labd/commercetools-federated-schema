import { stitchSchemas } from '@graphql-tools/stitch';

import { TypeSource, IResolvers } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import {
  FederationConfig,
  transformSchemaFederation,
} from 'graphql-transform-federation';
import { createExecutor, remoteCommercetoolsSchema } from './schema';
import { resolveCartReferenceById } from './resolvers/cart';
import { wrapSchema } from '@graphql-tools/wrap';

export const createCommercetoolsSchema = ({
  endpoint,
  transforms,
  typeDefs,
  resolvers,
  extraFederationConfig,
}: {
  endpoint: string;
  transforms: any;
  typeDefs: TypeSource | undefined;
  resolvers: IResolvers | undefined | any;
  extraFederationConfig: FederationConfig<any>;
}): GraphQLSchema => {
  const wrappedSchema = wrapSchema({
    schema: remoteCommercetoolsSchema,
    transforms,
    executor: createExecutor(endpoint),
  });

  const schema = stitchSchemas({
    subschemas: [wrappedSchema],
    typeDefs,
    resolvers,
    mergeTypes: true,
  });

  return transformSchemaFederation(schema, {
    Query: { extend: true },
    Cart: {
      keyFields: ['id'],
      resolveReference: resolveCartReferenceById,
    },
    ...extraFederationConfig,
  });
};
