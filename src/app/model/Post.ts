export class Post {
  constructor(
    public id: number = 0,
    public createdOn: string = "",
    public username: string = "",
    public profileImageUrl: string = "",
    public message: string = "",
    public imageUrl: string = "",
    public numLikes: number = 0,
    public numComments: number = 0,
    public hasLiked: boolean = false
  ) {}
}
