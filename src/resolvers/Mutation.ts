import {getUserId} from '../util/util.js';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {APP_SECRET} from '../const/const';
import {pubSub} from '../index';

export const Mutation = {
    // 게시물 작성
    writePost: (_: any, {title, description, tags}: any, context: any) => {
        // jwt에서 userId 꺼내온다
        const id = getUserId(context);
        return context.prisma.createPost({
            writer: {connect: {id}},       // **중첩 객체 쓰기 : userId를 이용하여 User를 연결한다
            title,
            description,
            tags : {set: tags}                     // **Array 넣기 위해선 이와 같은 구조로 써주어야 한다. prisma client의 PostCreatetagsInput 참고
            // tslint:disable-next-line:no-shadowed-variable
        }).then((Post:any)=>{
            // @ISSUE : Post에 writer 데이터는 포함되어 있지 않아서 subscribe에서 writer type 조회가 되지 않음
            // new post data publish
            pubSub.publish('newPost', Post);
            return Post;
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
