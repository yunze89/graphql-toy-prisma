import {pubSub} from '../index';

// pubsub는 같은 인스턴스가 subsription과 mutation에서 사용 될 수 있도록 선언하고 사용해야 한다.
// subscription의 경우 context가 전달되지 않는 이슈가 있다. 그래서 context를 통한 prisma instance 사용이 불가하더라
// @todo graphql yoga로 적용해보고 동작여부를 테스트해봐야겠다
export const Subscription = {
    newPost : {
        subscribe: ()=> {
            // prisma
            // return prismaInstance.$subscribe.post({mutation_in: ['CREATED']}).node()
            return pubSub.asyncIterator('newPost');
        },
        resolve: (payload: any)=> {
            return payload;
        }
    }
};
