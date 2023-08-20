export class Follower {
    constructor(
        public id: number = 0,
        public username: string = "",
        public profileImageUrl: string = "",
        public name: string = "",
        public bio: string = "",
        public followerCount: number = 0,
        public followingCount: number = 0
    ) {}
}
