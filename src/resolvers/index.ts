import {Post} from './Post';
import {User} from './User';
import {Query} from './Query';
import {Mutation} from './Mutation';
import { IResolvers } from 'graphql-tools';
import {Subscription} from './Subscription';

const resolvers:IResolvers={
    Post,
    User,
    Query,
    Mutation,
    Subscription
};

export default resolvers;

