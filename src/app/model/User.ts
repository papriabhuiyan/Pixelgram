export class User {
    constructor(
        public id: number = 0,
        public username: string = 'DEFAULT',
        public profileImageUrl: string | null = null,
        public name: string = '',
        public bio: string = '',
        public followerCount: number = 0,
        public followingCount: number = 0,
        public accessToken: string = ''
    ){}
}