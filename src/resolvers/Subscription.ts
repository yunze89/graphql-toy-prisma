// subscription이 처음엔 동작하지 않았음. 두번째 시도시에 websocket 자체가 연결 실패됨
// express-graphql 자체가 웹소켓이 내장되어 있지 않은 것 같은데, 처음에 시도했을 때 웹소켓 연결실패 메시지는 안떳었던 것이 이상하다
// graphql yoga로 정상 동작
export const Subscription = {
    newPost : {
        subscribe: (parent:any, args:any, context:any)=> {
            return context.prisma.$subscribe.post({mutation_in: ['CREATED']}).node()
        },
        resolve: (payload:any) =>{
            return payload;
        }
    }
};
