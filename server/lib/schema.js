import { merge } from 'lodash';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { makeExecutableSchema } from 'graphql-tools';

const rootSchema = [`
scalar Date

type User {
  # The name of the user, e.g. apollostack
  _id: String!
  name: String!
  createdAt: Date!
  authenticationProvider: String
}

type Tag {
  _id: ID!
  user: User!
  
  name: String!
  color: String!
  
  links: [Link]
}

# Information about a link
type Link {
  _id: ID!
  user: User!
  
  url: String!
  domain: String!
  path: String!
  name: String!
  description: String!
  
  createdAt: Date!

  # Comments posted about this repository
  # tags(limit: Int, offset: Int): [Tag]!
  tags: [Tag]!
}
input InputLink {
  _id: ID!
  url: String
  domain: String
  path: String
  name: String
  description: String
}

type Query {
  # Return the currently logged in user, or null if nobody is logged in
  currentUser: User

  links(
    # The number of items to skip, for pagination
    offset: Int,

    # The number of items to fetch starting from the offset, for pagination
    limit: Int
  ): [Link]
  
  link(linkId: ID): Link
  
  tags(
    offset: Int,
    limit: Int
  ): [Tag]
  
  tag(tagId: ID): Tag
}

type Mutation {
  submitLink(
    url: String!
  ): Link
  
  updateLink(
    link: InputLink!
  ): Link
  
  deleteLink(
    linkId: ID!
  ): Link

  addTagByNameToLink(
    linkId: ID!
    name: String!
  ): Link
  
  removeTagByIdFromLink(
    linkId: ID!
    tagId: ID!
  ): Link
}

schema {
  query: Query
  mutation: Mutation
}
`];

const rootResolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
  Link: {
    tags(link, args, context) {
      return context.Tag.find({ _id: { $in: link.tags } });
    }
  },
  Tag: {
    links(tag, args, context) {
      return context.Link.find({ tags: tag });
    }
  },
  Query: {
    currentUser(root, args, context) {
      return context.user || null;
    },
    link(root, { linkId }, context) {
      if (!context.user) {
        throw new Error("Need to be logged in to fetch a link.");
      }
      return context.Link.findById(linkId);
    },
    links(root, { offset, limit }, context) {
      if (!context.user) {
        throw new Error("Need to be logged in to fetch links.");
      }
      const protectedLimit = (limit < 1 || limit > 10) ? 10 : limit;
      return context.Link.find({ user: context.user })
        .sort({ createdAt: -1 })
        .limit(protectedLimit)
        .exec();
    },
    tag(root, { tagId }, context) {
      if (!context.user) {
        throw new Error("Need to be logged in to fetch a tag.");
      }
      return context.Tag.findById(tagId);
    },
    tags(root, { offset, limit }, context) {
      if (!context.user) {
        throw new Error("Need to be logged in to fetch links.");
      }
      const protectedLimit = (limit < 1 || limit > 10) ? 10 : limit;
      return context.Tag.find({ user: context.user })
      // .sort({ createdAt: -1 })
        .limit(protectedLimit)
        // .populate("tags")
        .exec();
    }
  },
  Mutation: {
    submitLink(root, { url }, context) {
      if (!context.user) {
        throw new Error("Need to be logged in to submit links.");
      }
      return new context.Link({
        url,
        user: context.user,
        createdAt: new Date()
      }).save()
    },
    updateLink(root, { link: { _id, ...props } }, context) {
      if (!context.user) {
        throw new Error("Need to be logged in to update links.");
      }
      return context.Link.findOne({ _id, user: context.user }).then((link) => {
        if (!link) {
          throw new Error("Resource could not be found.");
        }

        for (let propName in props) {
          if (!props.hasOwnProperty(propName)) {
            continue;
          }
          link[propName] = props[propName];
        }
        return link.save();
      });
    },
    deleteLink(root, { linkId }, context) {
      if (!context.user) {
        throw new Error("Need to be logged in to delete links.");
      }
      return context.Link.findOne({ _id: linkId, user: context.user }).then((link) => {
        if (!link) {
          throw new Error("Resource could not be found.");
        }

        return link.remove();
      });
    },
    addTagByNameToLink(root, { linkId, name }, context) {
      if (!context.user) {
        throw new Error("Need to be logged in to tag links.");
      }
      return context.Tag.findOne({ name, user: context.user }).then((tag) => {
        if (tag) {
          return tag;
        }
        return new context.Tag({ name, color: "lightgray", user: context.user }).save();
      }).then((tag) => {
        return context.Link.findOneAndUpdate(
          { _id: linkId },
          { $addToSet: { tags: tag._id }}
        )
          .exec()
          .then(({ _id }) => context.Link.findOne({ _id }));
      });
    },
    removeTagByIdFromLink(root, {linkId, tagId}, context) {
      if (!context.user) {
        throw new Error("Need to be logged in to untag links.");
      }
      return context.Link.findOneAndUpdate(
        { _id: linkId, user: context.user },
        { $pull: { tags: tagId }}
      )
        .exec()
        .then(({ _id }) => context.Link.findOne({ _id }));
    }
  }
};

// Put schema together into one array of schema strings
// and one map of resolvers, like makeExecutableSchema expects
const schema = [...rootSchema];
const resolvers = merge(rootResolvers);

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

export default executableSchema;
