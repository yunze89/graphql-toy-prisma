import cookieParser from 'cookie-parser';
import express from 'express';
import { Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import BaseRouter from './routes';

// [graphql] import graphql library module
import graphqlHttp from 'express-graphql';
import {makeExecutableSchema} from 'graphql-tools';

// [graphql] import prisma client
import { prisma } from './generated/prisma-client';

// [graphql] import type, resolver implementation
// import resolvers from './schema/resolvers';
import resolvers from './resolvers/index';
import typeDefs from './schema/type';


// Init express
const app = express();

// Add middleware/settings/routes to express.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/api', BaseRouter);

// [graphql] graphql endpoint 추가
app.use('/graphql',graphqlHttp((request)=>({
        graphiql: true,                                     // graphql 테스트 툴 활성화
        schema: makeExecutableSchema({typeDefs, resolvers}), // 구현한 type, resolver 함수를 schema로 생성 (feat. graphql-tools)
        context: {
            prisma,
            request
        }
        // prisma client 인스턴스를 context에 추가하여 resolve에서 접근할 수 있도록 함.
    })
));

/**
 * Point express to the 'views' directory. If you're using a
 * single-page-application framework like react or angular
 * which has its own development server, you might want to
 * configure this to only serve the index file while in
 * production mode.
 */
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
app.get('*', (req: Request, res: Response) => {
    res.sendFile('index.html', {root: viewsDir});
});

// Export express instance
export default app;
