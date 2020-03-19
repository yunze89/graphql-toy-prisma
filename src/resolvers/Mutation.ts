import {getUserId} from '../util/util.js';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {APP_SECRET} from '../const/const';

export const Mutation = {
    // 게시물 작성
    writePost: (_: any, {title, description, tags}: any, context: any) => {
        // jwt에서 userId 꺼내온다
        const userId = getUserId(context);

        return context.prisma.createPost({
            writer: {connect: {id: userId}},       // **중첩 객체 쓰기 : userId를 이용하여 User를 연결한다
            title,
            description,
            tags
        });
    },
    // 회원가입
    signUp: async (_: any, args: any, context: any) => {
        // user의 비밀번호 암호화
        const pw = await bcrypt.hash(args.pw, 10);

        // prisma client 인스턴스의 메서드 이용하여 새로운 user 생성
        const user = await context.prisma.createUser({
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
};

/*export class Mutation {
    // 게시물 작성
    writePost(_: any, {title, description, tags}: any, context: any) {
        // jwt에서 userId 꺼내온다
        const userId = getUserId(context);

        return context.prisma.createPost({
            writer: {connect: {id: userId}},       // **중첩 객체 쓰기 : userId를 이용하여 User를 연결한다
            title,
            description,
            tags
        });
    }

    // 회원가입
    async signUp(_: any, args: any, context: any) {
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
}*/
