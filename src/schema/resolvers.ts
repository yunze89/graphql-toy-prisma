import { IResolvers } from 'graphql-tools';
import Posts from '../hardcode/post';
import Users from '../hardcode/user';

const resolvers :IResolvers = {
    Post:{
        writer: post => Users.find((user: {id: any;}) => String(post.writer) === String(user.id))
    },
    User:{
        posts: (_,{writer}) => Posts.filter( (post: { writer: any; }) => String(post.writer) === writer.id)
    },
    Query:{
        posts: () => Posts,
        post: (_,{id}) => Posts.find( (post: { id: any; }) => String(post.id) === id ),
        // users:() => Users,
        user: (_,{id}) => Users.find( (user: any) => String(user.id) === id ),
    },
    Mutation:{
        writePost: (_, {writer, title, description, tags}) =>{
            const id = Posts.length +1;
            const post = {
                id,
                title,
                description,
                writer,
                tags
            };
            Posts.push(post);
            return post;
        },
        signIn: (_,{email, pw, name})=>{
            const id = Users.length+1;
            const user = {
                id,
                email,
                pw,
                name
            };
            Users.push(user);
            return user;
        }
    }
}

export default resolvers;
