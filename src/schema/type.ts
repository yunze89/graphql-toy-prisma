const typeDefs = `
    type User {
        id: ID!
        pw: String
        name: String
        email: String
        posts: [Post]               #해당 field를 위한 resolver 함수 구현
    }
    type AuthPayload{
        token: String
        user: User
    }
    type Post {
        title: String!
        description: String
        id: ID!
        writer: User!               #해당 field를 위한 resolver 함수 구현
        tags: [String]
    }
    ## Query 정의 (조회) : entry point
    type Query{
        posts: [Post]               #posts list 조회
        post(id: ID): Post          #argument query(post id 조건 검색)
        user(id: ID): User          #argument query(user id 조건 검색)
        signIn(emali: String!, pw: String!): AuthPayload
    }
    ## Mutation 정의 (수정성 요청) : entry point
    type Mutation{
        writePost(title: String, description: String, tags:[String]): Post
        signUp(email: String!, pw: String!, name: String!): AuthPayload     #User에서 수정
    }
`

export default typeDefs;
