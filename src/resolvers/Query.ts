import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {APP_SECRET} from '../const/const';

export const Query = {
    // prisma client 인스턴스의 메서드 이용
    posts: async (_:any, args:any, context:any) => {
        // filter 조건 추가
        const where = args.filter ? {
                OR: [
                    { description_contains: args.filter},   // description 포함
                    { title_contains: args.filter}          // title 포함되어 있는 것 filtering
                ],
            } : {};

        // paging 위한 argument - Offset(시작 인덱스)/Limit(개수)을 이용한 방법
        // skip - Offset : Prisma API상 Offset(Start) 시작 인덱스를 뜻하며, 해당 개수만큼 건너뛴다는 의미이다. (Default : 0)
        // first - Limit : Limit은 Prisma API상 first에 해당된다. 제공된 시작 인덱스 이후 등장하는 X개 요소 가져온다.
        const {skip, first, orderBy} = args;

        // post 목록
        const posts = await context.prisma.posts({
            where,
            skip,
            first,
            orderBy
        });

        // 현재 데이터베이스 상에 저장된 Post 요소 총 개수
        const count = await context.prisma
            .postsConnection({where})
            .aggregate()
            .count();

        // 최종 Posts 객체 반환
        return {posts,count};
    },
    post: (_:any, {id}:any, context:any) => context.prisma.post( {id}),
    user: (_:any, {id}:any, context:any) => context.prisma.user({id}),

    // 로그인
    signIn: async(_:any, args:any, context:any) => {
        // email로 user query (type 정의 시 email을 @unique로 지정 필요)
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
};

/*
export class Query {
    // prisma client 인스턴스의 메서드 이용
    posts(_:any, args:any, context:any) {
        return context.prisma.posts()
    }

    post(_:any, {id}:any, context:any) {
        return context.prisma.post({id})
    }

    user(_:any, {id}:any, context:any) {
        return context.prisma.user({id})
    }

    // 로그인
    async signIn(_:any, args:any, context:any) {
        // email로 user query (type정의시 email을 @unique로 지정 필요)
        const user = await context.prisma.user({
            email: args.email
        });

        // user 검색 결과 여부 확인
        if (!user)
            throw new Error('No such user found');

        // password 확인
        const valid = await bcrypt.compare(args.pw, user.pw);
        if (!valid)
            throw new Error('Invalid password');

        // password 검증 된 경우 JWT 생성
        const token = jwt.sign({userId: user.id}, APP_SECRET);

        // AuthPayload type 반환
        return {
            token,
            user
        }
    }
}
*/
