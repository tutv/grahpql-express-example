const express = require('express');
const graphqlHTTP = require('express-graphql');
let port = 3000;

const schema = require('./schema');

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(port, () => {
    console.log('GraphQL API server running at localhost:' + port);
});