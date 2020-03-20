export const Subscription = {
    newPost : {
        subscribe: (parent:any, args:any, context:any)=> {
            // tslint:disable-next-line:no-console
            console.log('susbscribe');
            return context.prisma.$subscribe.post({ mutation_in: ['CREATED'] }).node();
        },
        resolve: (payload:any) =>{
            // tslint:disable-next-line:no-console
            console.log(payload);
            return payload;
        }
    }
};
