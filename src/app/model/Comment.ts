import { User } from '../model/User'

export class PostComment{
    constructor(
        public createdOn: string,
        public id: number | undefined,
        public postId: number | undefined,
        public author: User,
        public message: string,
    ){}
}