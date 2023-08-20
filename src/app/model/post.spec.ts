import { Post } from './Post';

describe('Post', () => {
  it('should create an instance', () => {
    expect(new Post(0,'', '', '', '', '', 0, 0)).toBeTruthy();
  });
});
