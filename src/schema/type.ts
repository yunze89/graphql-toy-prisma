const typeDefs = `
    type User {
        id: ID!,
        pw: String,
        name: String,
        email: String,
        posts: [Post]
    }
    type Post {
        title: String,
        description: String,
        id: ID!,
        writer: User!,
        tags: [String]
    }
    type Query{
        posts: [Post],              #posts list 조회
        post(id: ID): Post,         #argument query(post 조건 검색)
        #users: [User],
        user(id: ID): User          #argument query(user 조건 검색)
    }
    type Mutation{
        writePost(writerId: ID, title: String, description: String, tags:[String]): Post,
        signIn(email: String, pw: String, name: String): User
    }
`

export default typeDefs;
