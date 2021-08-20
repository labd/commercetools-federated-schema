import { GraphQLResolveInfo, Kind, SelectionSetNode } from 'graphql'
import { delegateToSchema } from '@graphql-tools/delegate'
import { WrapQuery } from '@graphql-tools/wrap'

export const resolveMyCustomer = async (_args: any,  context: Record<string, any>,
  info: GraphQLResolveInfo) => {
  const result = await delegateToSchema({
   schema: info.schema,
    operation: 'query',
    fieldName: 'me',
    transforms: [
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
                  value: 'customer',
                },
                selectionSet: {
                  kind: Kind.SELECTION_SET,
                  selections: subtree.selections,
                },
              },
            ],
          }
        },
        (result) => {
          return [result.customer]
        }
      ),
    ],
    info,
    context,
  })

  return result[0]
}
