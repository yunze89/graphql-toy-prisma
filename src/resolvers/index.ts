import {Post} from './Post';
import {User} from './User';
import {Query} from './Query';
import {Mutation} from './Mutation';
import { IResolvers } from 'graphql-tools';

const resolvers:IResolvers={
    Post,
    User,
    Query,
    Mutation,
};

export default resolvers;

