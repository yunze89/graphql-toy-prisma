import typeDefs from './schema/type';
import resolvers from './resolvers';
import {makeExecutableSchema} from 'graphql-tools';

export const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
