import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {APP_SECRET} from '../const/const';

export const Query = {
    // prisma client 인스턴스의 메서드 이용
    posts: async (_:any, args:any, context:any) => {
        const where = args.filter ? {
                OR: [
                    { description_contains: args.filter},   // description 포함
                    { title_contains: args.filter}          // title 포함되어 있는 것 filtering
                ],
            } : {};
        const posts = await context.prisma.posts({
            where
        });
        return posts;
    },
    post: (_:any, {id}:any, context:any) => context.prisma.post( {id}),
    user: (_:any, {id}:any, context:any) => context.prisma.user({id}),

    // 로그인
    signIn: async(_:any, args:any, context:any) => {
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
