import { makeUser } from '@/test/factories';

import { User } from './User';

describe('User', () => {
  describe('constructor', () => {
    it('assigns all provided properties', () => {
      const user = new User('id1', 'a@b.com', 'Alice', '2024-01-01', '2024-01-01', '2024-01-01');
      expect(user.date_created).toBe('2024-01-01');
      expect(user.email).toBe('a@b.com');
      expect(user.id).toBe('id1');
      expect(user.last_login).toBe('2024-01-01');
      expect(user.last_modified).toBe('2024-01-01');
      expect(user.name).toBe('Alice');
    });

    it('defaults null dates to current ISO string', () => {
      const before = new Date().toISOString();
      const user = new User('id1', 'a@b.com', 'Alice', null, null, null);
      const after = new Date().toISOString();
      expect(user.date_created! >= before && user.date_created! <= after).toBe(true);
      expect(user.last_login! >= before && user.last_login! <= after).toBe(true);
      expect(user.last_modified! >= before && user.last_modified! <= after).toBe(true);
    });
  });

  describe('updateEmail', () => {
    it('updates email when 100 chars or fewer', () => {
      const user = makeUser();
      user.updateEmail('new@example.com');
      expect(user.email).toBe('new@example.com');
    });

    it('updates email with exactly 100 characters', () => {
      const user = makeUser();
      const email = 'a'.repeat(100);
      user.updateEmail(email);
      expect(user.email).toBe(email);
    });

    it('rejects email longer than 100 characters', () => {
      const user = makeUser();
      const original = user.email;
      const spy = jest.spyOn(console, 'log').mockImplementation();
      user.updateEmail('a'.repeat(101));
      expect(user.email).toBe(original);
      spy.mockRestore();
    });

    it('rejects empty string', () => {
      const user = makeUser();
      const original = user.email;
      const spy = jest.spyOn(console, 'log').mockImplementation();
      user.updateEmail('');
      expect(user.email).toBe(original);
      spy.mockRestore();
    });
  });

  describe('updateName', () => {
    it('updates name when 100 chars or fewer', () => {
      const user = makeUser();
      user.updateName('New Name');
      expect(user.name).toBe('New Name');
    });

    it('updates name with exactly 100 characters', () => {
      const user = makeUser();
      const name = 'a'.repeat(100);
      user.updateName(name);
      expect(user.name).toBe(name);
    });

    it('rejects name longer than 100 characters', () => {
      const user = makeUser();
      const original = user.name;
      const spy = jest.spyOn(console, 'log').mockImplementation();
      user.updateName('a'.repeat(101));
      expect(user.name).toBe(original);
      spy.mockRestore();
    });

    it('rejects empty string', () => {
      const user = makeUser();
      const original = user.name;
      const spy = jest.spyOn(console, 'log').mockImplementation();
      user.updateName('');
      expect(user.name).toBe(original);
      spy.mockRestore();
    });
  });

  describe('updateLastLoginToNow', () => {
    it('sets last_login to current ISO string', () => {
      const user = makeUser({ last_login: '2020-01-01T00:00:00.000Z' });
      const before = new Date().toISOString();
      user.updateLastLoginToNow();
      const after = new Date().toISOString();
      expect(user.last_login! >= before && user.last_login! <= after).toBe(true);
    });
  });

  describe('updateLastModifiedToNow', () => {
    it('sets last_modified to current ISO string', () => {
      const user = makeUser({ last_modified: '2020-01-01T00:00:00.000Z' });
      const before = new Date().toISOString();
      user.updateLastModifiedToNow();
      const after = new Date().toISOString();
      expect(user.last_modified! >= before && user.last_modified! <= after).toBe(true);
    });
  });
});
