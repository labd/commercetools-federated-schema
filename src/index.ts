import { stitchSchemas } from '@graphql-tools/stitch';

import { TypeSource, IResolvers } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import {
  FederationConfig,
  transformSchemaFederation,
} from 'graphql-transform-federation';
import { getWrappedSchema } from './schema';
import { resolveCartReferenceById } from './resolvers/cart';
import { resolveMyCustomer } from './resolvers/customer';

export const createCommercetoolsSchema = ({
  endpoint,
  transforms,
  typeDefs,
  resolvers,
  extraFederationConfig,
}: {
  endpoint: string;
  transforms?: any[];
  typeDefs?: TypeSource | undefined;
  resolvers?: IResolvers | undefined | any;
  extraFederationConfig?: FederationConfig<any>;
}): GraphQLSchema => {
  const wrappedSchema = getWrappedSchema(endpoint, transforms || []);
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
    Customer: {
      resolveReference: resolveMyCustomer,
    },
    ...(extraFederationConfig || {}),
  });
};
