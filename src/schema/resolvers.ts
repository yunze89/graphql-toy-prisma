import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {APP_SECRET} from 'src/const/const';
import {getUserId} from 'src/util/util.js';

// import Posts from '../hardcode/post';   // 하드코딩 db 데이터 (db에서 fetch한 데이터 모델이라고 가정)
// import Users from '../hardcode/user';   // 하드코딩 db 데이터 (db에서 fetch한 데이터 모델이라고 가정)

// graphql resolver 구현부
// resolver 함수의 paramter는 총 4개 - (root, args, context, info)
// query의 argument를 전달받기 위해선 두번째 파라미터를 사용
// prisma client를 사용하기 위해선 세번째 파라미터를 사용

const resolvers :IResolvers = {
    Post:{
        // post type의 User(post의 writer field) 객체 접근하기 위한 resolver : parent는 Post 객체
        // prisma client 인스턴스의 메서드 이용
        writer: (parent, _, context) => context.prisma.post({id:parent.id}).writer()

        // id, title 등 다른 field들은 db에서 fetch 했다고 가정한 데이터 모델과 field가 1:1 매핑 되므로 정의해주지 않아도 매핑됨
    },
    User:{
        // user type의 [Post](user의 posts field) 객체 배열에 사용된 Post 객체 접근하기 위한 resolver 함수 : parent는 User 객체
        // prisma client 인스턴스의 메서드 이용
        posts: (parent, _,context) => context.prisma.user({id:parent.id}).posts()

        // id, name 등 다른 field들은 db에서 fetch 했다고 가정한 데이터 모델과 field가 1:1 매핑 되므로 정의해주지 않아도 매핑됨
    },
    Query:{
        // prisma client 인스턴스의 메서드 이용
        posts: (_, args, context) => context.prisma.posts(),
        post: (_, {id}, context) => context.prisma.post( {id}),
        user: (_, {id}, context) => context.prisma.user({id}),

        // 로그인
        signIn: async(_, args, context) => {
            // email로 user query (type정의시 email을 @unique로 지정 필요)
            const user = await context.prisma.user({
                email: args.email
            });

            // user 검색 결과 여부 확인
            if(!user)
                throw new Error('No such user found');

            // password 확인
            const valid = await bcrypt.compare(args.pw, user.pw);
            if(!valid)
                throw new Error('Invalid password');

            // password 검증 된 경우 JWT 생성
            const token = jwt.sign({userId: user.id}, APP_SECRET);

            // AuthPayload type 반환
            return{
                token,
                user
            }
        }
    },
    Mutation: {
        // 게시물 작성
        writePost: (_, {title, description, tags}, context) =>{
            // jwt에서 userId 꺼내온다
            const userId = getUserId(context);

            return context.prisma.createPost({
                writer: {connect: {id: userId} },       // **중첩 객체 쓰기 : userId를 이용하여 User를 연결한다
                title,
                description,
                tags
            });
        },
        // 회원가입
        signUp: async (_, args, context) => {
            // user의 비밀번호 암호화
            const pw = await bcrypt.hash(args.pw, 10);

            // prisma client 인스턴스의 메서드 이용하여 새로운 user 생성
            const user = context.prisma.createUser({
                ...args,    // email, name parameter 값
                pw,
            });

            // APP_SCRET 값으로 서명된 JWT 생성
            const token = jwt.sign({userId: user.id}, APP_SECRET);

            // AuthPayload type 반환
            return {
                token,
                user
            }
        }
    }
};

export default resolvers;
