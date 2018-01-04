const graphql = require('graphql');
const axios = require('axios');
// it's just a shortcut to void to write something like this : graphql.GraphQLObjectType or graphql.GraphQLString
const {
    GraphQLObjectType, // <=> GraphQLObjectType = graphql.GraphQLObjectType
    GraphQLString, // <=> GraphQLString = graphql.GraphQLString
    GraphQLInt, // <=> GraphQLInt = graphql.GraphQLInt
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                console.log(parentValue, args);
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(resp => resp.data);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        company: {
            type: CompanyType,
            resolve(parentValue, args) { // parentValue contains result from parent query (rootQuery here)
                console.log(parentValue, args);
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(resp => resp.data); // axios does not return data directly
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: { // name of a root query
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {  // resolve function purpose : You're looking for a user with ID 23, I'll do my best to find it.
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp => resp.data);
            }
        },
        company: { // name of a root query
            type: CompanyType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {  // resolve function purpose : You're looking for a user with ID 23, I'll do my best to find it.
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(resp => resp.data);
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'MutationType',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLInt},
                companyId: {type: GraphQLString}
            },
            resolve(parentValue, {firstName, age}) {
                return axios.post('http://localhost:3000/users', {firstName, age})
                    .then(res => res.data);
            }
        }
    }
});

// make it available to other parts of my application
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});