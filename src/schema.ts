import { print } from 'graphql';
import path from 'path';
import fetch from 'node-fetch';
import { HttpsAgent } from 'agentkeepalive';

import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';

const keepAliveAgent = new HttpsAgent();

export const createExecutor = (endpoint: string) => {
  return async ({ document, variables, context }: any) => {
    const query = print(document);
    const fetchResult = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: context.authorization,
      },
      body: JSON.stringify({ query, variables }),
      agent: keepAliveAgent,
    });

    const res = await fetchResult.json();

    if (res.error || res.errors?.length) {
      const uninterestingErrorCodes = ['ConcurrentModification'];
      if (
        !res.errors?.length ||
        (res.errors?.length &&
          !res.errors.some((e: any) =>
            uninterestingErrorCodes.includes(e.code)
          ))
      ) {
        console.error(
          `Error in CT call ${JSON.stringify(query)}: ${
            res.error
          } ${JSON.stringify(res.errors)}`
        );
      }
    }

    return res;
  };
};

// load the commercetools schema
export const remoteCommercetoolsSchema = loadSchemaSync(
  path.join(__dirname, './schema.graphql'),
  {
    loaders: [new GraphQLFileLoader()],
  }
);
