import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus';

import { NexusGenObjects } from '../../nexus-typegen';

export const Link = objectType({
    name: 'Link',
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('description')
        t.nonNull.string('url')
    }
})  

let links: NexusGenObjects["Link"][]= [   // 1
    {
        id: 1,
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL",
    },
    {
        id: 2,
        url: "graphql.org",
        description: "GraphQL official website",
    },
];

export const LinkQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('feed', {
            type: 'Link',
            resolve(parent, args, context, info) {
                return links
            }
        })
        t.field('link', {
            type: 'Link',
            args: {
                id: nonNull(intArg())
            },
            resolve(parent, args, context, info) {
                const { id } = args
                const link =  links.find(link => link.id === id)
                if (link) {
                    return link
                }
                return null
            }
        })
    }
})

export const LinkMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('post', {
            type: 'Link',
            args: {
                description: nonNull(stringArg()),
                url: nonNull(stringArg())
            },
            resolve(parent, args, context, info) {
                const { description, url } = args
                const id = links.length + 1
                const link = {
                    id, description, url
                }
                links.push(link)
                return link
            }
        })
    }
})