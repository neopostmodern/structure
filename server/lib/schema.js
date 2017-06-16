import { merge } from 'lodash';
import Moment from 'moment';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { makeExecutableSchema } from 'graphql-tools';

const rootSchema = [`
scalar Date

type User {
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
  
  notes: [Note]
}
input InputTag {
  _id: ID!
  
  name: String!
  color: String!
}

enum NoteType {
  TEXT
  LINK
}

interface INote {
  type: NoteType!
  _id: ID!
  user: User!

  name: String!
  description: String!
  
  createdAt: Date!

  # Comments posted about this repository
  # tags(limit: Int, offset: Int): [Tag]!
  tags: [Tag]!
}

type Text implements INote {
  type: NoteType!
  _id: ID!
  user: User!

  name: String!
  description: String!
  
  createdAt: Date!

  # Comments posted about this repository
  # tags(limit: Int, offset: Int): [Tag]!
  tags: [Tag]!
}
input InputText {
  _id: ID!
  name: String
  description: String
}

# Information about a link
type Link implements INote {
  type: NoteType!
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

union Note = Link | Text

type Query {
  # Return the currently logged in user, or null if nobody is logged in
  currentUser: User

  links(
    # The number of items to skip, for pagination
    offset: Int,

    # The number of items to fetch starting from the offset, for pagination
    limit: Int
  ): [Link]
  
  notes(
    offset: Int,
    limit: Int
  ): [Note]
  
  link(linkId: ID): Link
  text(textId: ID): Text
  
  tags(
    offset: Int,
    limit: Int
  ): [Tag]
  
  tag(tagId: ID): Tag
}

type Mutation {
  updateTag(
    tag: InputTag!
  ): Tag
  
  submitLink(
    url: String!
  ): Link
  updateLink(
    link: InputLink!
  ): Link
  deleteLink(
    linkId: ID!
  ): Link
  
  createText: Text
  updateText(
    text: InputText!
  ): Text
  deleteText(
    textId: ID!
  ): Text
  
  addTagByNameToNote(
    noteId: ID!
    name: String!
  ): Link
  
  removeTagByIdFromNote(
    noteId: ID!
    tagId: ID!
  ): Link
}

schema {
  query: Query
  mutation: Mutation
}
`];

const INoteResolvers = {
  tags(note, args, context) {
    return context.Tag.find({ _id: { $in: note.tags } });
  }
};
const typeEnumFixer = (notes) => (
// eslint-disable-next-line no-underscore-dangle
  notes.map((note) => Object.assign({}, note._doc, { type: note.type.toUpperCase() }))
);

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
  Note: {
    __resolveType(obj, context, info) {
      // console.log("__resolveType", obj.type, obj.type[0].toUpperCase() + obj.type.substring(1).toLowerCase());
      return obj.type[0].toUpperCase() + obj.type.substring(1).toLowerCase();
    },
  },
  Link: INoteResolvers,
  Text: INoteResolvers,
  Tag: {
    notes(tag, args, context) {
      return context.Note.find({ tags: tag })
        .then(typeEnumFixer);
    }
  },
  Query: {
    currentUser(root, args, context) {
      return context.user || null;
    },
    notes(root, { offset, limit }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch links.');
      }
      const protectedLimit = (limit < 1 || limit > 10) ? 10 : limit;
      return context.Note.find({ user: context.user })
        .sort({ createdAt: -1 })
        .limit(protectedLimit)
        .exec()
        .then(typeEnumFixer);
    },
    link(root, { linkId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch a link.');
      }
      return context.Link.findById(linkId);
    },
    links(root, { offset, limit }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch links.');
      }
      const protectedLimit = (limit < 1 || limit > 10) ? 10 : limit;
      return context.Link.find({ user: context.user })
        .sort({ createdAt: -1 })
        .limit(protectedLimit)
        .exec();
    },
    text(root, { textId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch a text.');
      }
      return context.Text.findById(textId);
    },
    tag(root, { tagId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch a tag.');
      }
      return context.Tag.findById(tagId);
    },
    tags(root, { offset, limit }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch links.');
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
    updateTag(root, { tag: { _id, ...props } }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to update tags.');
      }
      return context.Tag.findOne({ _id, user: context.user }).then((tag) => {
        if (!tag) {
          throw new Error('Resource could not be found.');
        }

        Object.entries(props).forEach(([propName, propValue]) => {
          tag[propName] = propValue;
        });
        return tag.save();
      });
    },
    submitLink(root, { url }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to submit links.');
      }
      return new context.Link({
        url,
        user: context.user,
        createdAt: new Date()
      }).save();
    },
    updateLink(root, { link: { _id, ...props } }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to update links.');
      }
      return context.Link.findOne({ _id, user: context.user }).then((link) => {
        if (!link) {
          throw new Error('Resource could not be found.');
        }

        Object.entries(props).forEach(([propName, propValue]) => {
          link[propName] = propValue;
        });
        return link.save();
      });
    },
    deleteLink(root, { linkId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to delete links.');
      }
      return context.Link.findOne({ _id: linkId, user: context.user }).then((link) => {
        if (!link) {
          throw new Error('Resource could not be found.');
        }

        return link.remove();
      });
    },

    createText(root, {}, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to create texts.');
      }

      return new context.Text({
        name: new Moment().format('dddd, MMMM Do YYYY'),
        user: context.user,
        createdAt: new Date()
      }).save();
    },
    updateText(root, { text: { _id, ...props } }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to update texts.');
      }
      return context.Text.findOne({ _id, user: context.user }).then((text) => {
        if (!text) {
          throw new Error('Resource could not be found.');
        }

        Object.entries(props).forEach(([propName, propValue]) => {
          text[propName] = propValue;
        });
        return text.save();
      });
    },
    deleteText(root, { textId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to delete texts.');
      }
      return context.Text.findOne({ _id: textId, user: context.user }).then((text) => {
        if (!text) {
          throw new Error('Resource could not be found.');
        }

        return text.remove();
      });
    },

    addTagByNameToNote(root, { noteId, name }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to tag notes.');
      }
      return context.Tag.findOne({ name, user: context.user }).then((tag) => {
        if (tag) {
          return tag;
        }
        return new context.Tag({ name, color: 'lightgray', user: context.user }).save();
      }).then((tag) => context.Note.findOneAndUpdate(
          { _id: noteId },
          { $addToSet: { tags: tag._id } }
        )
          .exec()
          .then(({ _id }) => context.Note.findOne({ _id })));
    },
    removeTagByIdFromNote(root, { noteId, tagId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to untag notes.');
      }
      return context.Note.findOneAndUpdate(
        { _id: noteId, user: context.user },
        { $pull: { tags: tagId } }
      )
        .exec()
        .then(({ _id }) => context.Note.findOne({ _id }));
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
