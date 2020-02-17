import { IResolvers } from 'graphql-tools';
import Posts from '../hardcode/post';
import Users from '../hardcode/user';

// graphql resolver 구현

const resolvers :IResolvers = {
    Post:{
        // post type의 User(writer) 객체 접근하기 위한 함수
        writer: post => Users.find((user: {id: any;}) => String(post.writer) === String(user.id))
    },
    User:{
        /* user type의 [Post](posts) 객체 배열에 사용된 Post 객체 접근하기 위한 resolver 함수
         : user 객체의 id 값으로 posts 목록 조건 검색*/
        posts: user => Posts.filter( (post: { writer: any; }) => String(post.writer) === String(user.id))
    },
    Query:{
        posts: () => Posts,
        post: (_,{id}) => Posts.find( (post: { id: any; }) => String(post.id) === id ),
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
