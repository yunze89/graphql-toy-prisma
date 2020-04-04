import * as jwt from 'jsonwebtoken';
import {APP_SECRET} from 'src/const/const';

export const getUserId = (context:any) => {

    // **http header에 "Authorization : Bearer ${token}" 추가되어 있는 request 이어야 함**
    // 토큰은 서버로 들어오는 HTTP 요청의 authorization 헤더에서 얻을 수 있다.
    const Authorization = context.request.get('Authorization');

    if(Authorization){
        // context로 부터 authorization header를 가져와 해당 User의 id를 꺼내 반환한다
        const token = Authorization.replace('Bearer ','');
        const tokenValue:any= jwt.verify(token, APP_SECRET);
        return tokenValue.userId;
    }

    throw new Error('Not authenticated');
};
