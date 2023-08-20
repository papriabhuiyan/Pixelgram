import { PostComment } from './Comment';
import { User } from './User';

describe('Comment', () => {
  it('should create an instance', () => {
    expect(new PostComment('',0,0, new User(0, '','','','',0,0,''),'')).toBeTruthy()
  });
});