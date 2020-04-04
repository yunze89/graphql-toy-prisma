export const Post = {
    writer : (parent:any, _:any, context:any)=>{
        return context.prisma.post({id:parent.id}).writer();
    }
};
