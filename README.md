# Commercetools Schema Federation

## Installation

  yarn add @labdigital/commercetools-federated-schema

## Usage

```ts
import { createCommercetoolsSchema } from '@labdigital/commercetools-federated-schema';

let commercetoolsSchema: GraphQLSchema;

export const getCommercetoolsSchema = () => {
  if (!commercetoolsSchema) {
    commercetoolsSchema = createCommercetoolsSchema({
      endpoint: `${process.env.CT_API_URL}/${process.env.CT_PROJECT_KEY}/graphql`,
      transforms: transforms,
      typeDefs: [commercetoolsTypeDefs],
      resolvers: [commercetoolsResolvers],
    });
  }
  return commercetoolsSchema;
};
```
