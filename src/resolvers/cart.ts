import { GraphQLResolveInfo, Kind, SelectionSetNode } from 'graphql';
import { delegateToSchema } from '@graphql-tools/delegate';
import { WrapQuery } from '@graphql-tools/wrap';

export const resolveCartReferenceById = async (
  args: any,
  context: Record<string, any>,
  info: GraphQLResolveInfo
) => {
  const cartId = args.id;
  const result = await delegateToSchema({
    schema: info.schema,
    operation: 'query',
    fieldName: 'me',
    transforms: [
      // Transformer to wrap the query with `carts(id: "cart-id") { ... }`
      new WrapQuery(
        ['me'],
        (subtree: SelectionSetNode) => {
          return {
            kind: Kind.SELECTION_SET,
            selections: [
              {
                kind: Kind.FIELD,
                name: {
                  kind: Kind.NAME,
                  value: 'cart',
                },
                arguments: [
                  {
                    kind: Kind.ARGUMENT,
                    name: {
                      kind: Kind.NAME,
                      value: 'id',
                    },
                    value: {
                      kind: Kind.STRING,
                      value: cartId,
                    },
                  },
                ],
                selectionSet: {
                  kind: Kind.SELECTION_SET,
                  selections: subtree.selections,
                },
              },
            ],
          };
        },
        result => [
          {
            ...result.cart,
          },
        ]
      ),
    ],
    info,
    context,
  });

  if (!result.length) {
    return null;
  }
  return result[0];
};
