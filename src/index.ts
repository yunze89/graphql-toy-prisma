import './LoadEnv'; // Must be the first import
import app from '@server';
import { logger } from '@shared';
import {createServer} from 'http';
import {SubscriptionServer} from 'subscriptions-transport-ws';
import {execute, subscribe} from 'graphql';
// import {makeExecutableSchema} from 'graphql-tools';
import typeDefs from './schema/type';
import resolvers from './resolvers';
import {PubSub} from 'graphql-subscriptions';
import {executableSchema} from './shcema';

// Start the server
const port = Number(process.env.PORT || 3000);

// const server = createServer(app);

const server = createServer(app);

/*app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});*/

export const pubSub = new PubSub();

const subscriptionServer = new SubscriptionServer({
        execute,
        subscribe,
        schema: executableSchema},
        {
            server,
            path: '/graphql'
        });

server.listen(port, ()=>{
    logger.info('Express server started on port: ' + port);
    return subscriptionServer;
});
