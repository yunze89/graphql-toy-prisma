import { IResolvers } from 'graphql-tools';
// import Posts from '../hardcode/post';   // 하드코딩 db 데이터 (db에서 fetch한 데이터 모델이라고 가정)
// import Users from '../hardcode/user';   // 하드코딩 db 데이터 (db에서 fetch한 데이터 모델이라고 가정)

// graphql resolver 구현
// 실제 DB에서 데이터를 fetch하는 예제는 아니므로, resolver 정의하는 로직만 대략 파악하길 바람.
// resolver 함수의 paramter는 총 4개 - (root, args, context, info) 따라서 query의 argument를 전달받기 위해선 두번째 파라미터를 사용

const resolvers :IResolvers = {
    Post:{
        // post type의 User(post의 writer field) 객체 접근하기 위한 resolver
        // prisma client 인스턴스의 메서드 이용
        writer: (parent, args, context) => context.prisma.post({id:parent.id}).writer()

        // id, title 등 다른 field들은 db에서 fetch 했다고 가정한 데이터 모델과 field가 1:1 매핑 되므로 정의해주지 않아도 매핑됨
    },
    User:{
        /* user type의 [Post](user의 posts field) 객체 배열에 사용된 Post 객체 접근하기 위한 resolver 함수
         : user 객체의 id 값으로 posts 목록 조건 검색*/

        // prisma client 인스턴스의 메서드 이용
        posts: (parent,user,context) => context.prisma.user({id:parent.id}).posts()

        // id, name 등 다른 field들은 db에서 fetch 했다고 가정한 데이터 모델과 field가 1:1 매핑 되므로 정의해주지 않아도 매핑됨
    },
    Query:{
        // prisma client 인스턴스의 메서드 이용
        posts: (_, args, context) => context.prisma.posts(),
        post: (_,{id}, context) => context.prisma.post( {id}),
        user: (_,{id}, context) => context.prisma.user({id}),
    },
    Mutation: {
        writePost: (_, {writer, title, description, tags}, context) =>
            // prisma client 인스턴스의 메서드 이용
            context.prisma.createPost({
                writer,
                title,
                description,
                tags
            }),
        signUp: (_, {email, pw, name}, context) =>
            // prisma client 인스턴스의 메서드 이용
            context.prisma.createUser({
                email,
                pw,
                name
            })
    }
}

export default resolvers;
