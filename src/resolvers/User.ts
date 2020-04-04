/*export class User {
    posts(parent:any, _:any,context:any){
        return context.prisma.user({id:parent.id}).posts();
    }
}*/
export const User = {
    posts:(parent:any, _:any,context:any)=>{
        return context.prisma.user({id:parent.id}).posts();
    }
};
