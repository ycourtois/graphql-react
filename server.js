// this is where all the logic related to the Express side of our application is going to live

const express = require('express');

const schema = require('./schema/schema');

const expressGraphQL = require('express-graphql');

const app = express();

// app.use is ho we wire up middle to an express application
// middleware are tiny functions meant to intercept or modify requests as they come through an express server
app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('Listening');
});