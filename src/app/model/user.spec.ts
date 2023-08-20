import { User } from './User';

describe('User', () => {
    it('should create an instance for a user', () => {
      expect(new User(0, '','','','',0,0,'')).toBeTruthy();
    });
  });