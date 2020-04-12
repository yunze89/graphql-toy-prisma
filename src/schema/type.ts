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
    type Posts{
        posts: [Post]               #posts list 조회
        count: Int!                #post 목록의 개수
    }
    ## Query 정의 (조회) : entry point
    type Query{
        posts(filter: String, skip: Int, first: Int, orderBy: PostOrderByInput): Posts               #posts list 조회
        post(id: ID): Post                                                 #argument query(post id 조건 검색)
        user(id: ID): User                                                 #argument query(user id 조건 검색)
        signIn(email: String!, pw: String!): AuthPayload
    }
    ## Mutation 정의 (수정성 요청) : entry point
    type Mutation{
        writePost(title: String, description: String, tags:[String]): Post
        signUp(email: String!, pw: String!, name: String!): AuthPayload     #User에서 수정
    }
    ## Subscription 정의 (실시간 push)
    type Subscription{
        newPost: Post
    }
    #정렬위한 열거자 정의 - prisma api에서의 orderBy 참조
    enum PostOrderByInput {
        description_ASC
        description_DESC
        title_ASC
        title_DESC
    }
`;

export default typeDefs;
