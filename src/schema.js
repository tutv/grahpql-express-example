const _ = require('lodash');
const {
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema,
} = require('graphql');

const Authors = require('./data/authors'); // This is to make available authors.json file
const Posts = require('./data/posts');

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This represent an author",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        twitterHandle: {type: GraphQLString},
        posts: {
            type: new GraphQLList(PostType),
            description: "List posts of author",
            resolve: function (author) {
                return Posts.filter(post => post.author_id === author.id);
            }
        }
    })
});

const PostType = new GraphQLObjectType({
    name: "Post",
    description: "This represent a Post",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLString)},
        title: {type: new GraphQLNonNull(GraphQLString)},
        body: {type: GraphQLString},
        slug: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve: (post) => {
                return _.find(Authors, author => author.id === post.author_id);
            }
        }
    })
});

// This is the Root Query
const BlogQueryRootType = new GraphQLObjectType({
    name: 'BlogAppSchema',
    description: "Blog Application Schema Query Root",
    fields: () => ({
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List of all Authors",
            resolve: function () {
                return Authors
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            description: "List of all Posts",
            resolve: function () {
                return Posts
            }
        }
    })
});

// This is the schema declaration
const BlogAppSchema = new GraphQLSchema({
    query: BlogQueryRootType
    // If you need to create or updata a datasource,
    // you use mutations. Note:
    // mutations will not be explored in this post.
    // mutation: BlogMutationRootType
});

module.exports = BlogAppSchema;