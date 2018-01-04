const graphql = require('graphql');
const axios = require('axios');
// it's just a shortcut to void to write something like this : graphql.GraphQLObjectType or graphql.GraphQLString
const {
    GraphQLObjectType, // <=> GraphQLObjectType = graphql.GraphQLObjectType
    GraphQLString, // <=> GraphQLString = graphql.GraphQLString
    GraphQLInt, // <=> GraphQLInt = graphql.GraphQLInt
    GraphQLSchema
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString}
    }
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(resp => resp.data); // axios does not return data directly
            }
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: { // name of query
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {  // resolve function purpose : You're looking for a user with ID 23, I'll do my best to find it.
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp => resp.data);
            }
        }
    }
});

// make it available to other parts of my application
module.exports = new GraphQLSchema({
    query: RootQuery
})