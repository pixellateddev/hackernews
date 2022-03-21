import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus';

export const Link = objectType({
    name: 'Link',
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('description')
        t.nonNull.string('url')
        t.nonNull.dateTime('createdAt')
        t.field('postedBy', {
            type: 'User',
            resolve(parent, args, context) {
                return context.prisma.link.findUnique({where: {id: parent.id}}).postedBy()
            }
        })
        t.nonNull.list.nonNull.field('voters', {
            type: 'User',
            resolve(parent, args, context) {
                return context.prisma.link
                    .findUnique({ where: { id: parent.id }})
                    .voters()
            }
        })
    }
})  


export const LinkQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('feed', {
            type: 'Link',
            resolve(parent, args, context, info) {
                return context.prisma.link.findMany()
            }
        })
        t.field('link', {
            type: 'Link',
            args: {
                id: nonNull(intArg())
            },
            resolve(parent, args, context, info) {
                const { id } = args
                const link =  context.prisma.link.findFirst({where: {
                    id
                }})
                return link
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
                const { userId } = context
                if (!userId) {
                    throw new Error("Invalid Credentials")
                }
                const newLink = context.prisma.link.create({
                    data: {
                        description,
                        url,
                        postedBy: { connect: { id: userId }}
                    }
                })
                return newLink
            }
        })
    }
})