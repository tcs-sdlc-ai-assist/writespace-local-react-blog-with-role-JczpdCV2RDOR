import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPosts, savePosts, getUsers, saveUsers } from './storage';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns parsed posts array from localStorage', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Test content',
          date: '2024-01-15T00:00:00.000Z',
          authorId: 'user1',
          authorName: 'Test User',
          authorRole: 'user',
        },
        {
          id: '2',
          title: 'Another Post',
          content: 'More content',
          date: '2024-01-16T00:00:00.000Z',
          authorId: 'admin',
          authorName: 'Admin',
          authorRole: 'admin',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      const posts = getPosts();
      expect(posts).toEqual(mockPosts);
      expect(posts).toHaveLength(2);
      expect(posts[0].title).toBe('Test Post');
      expect(posts[1].authorRole).toBe('admin');
    });

    it('returns an empty array when localStorage throws an error', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_posts', 'not valid json{{{');

      const posts = getPosts();
      expect(posts).toEqual([]);
    });
  });

  describe('savePosts', () => {
    it('saves posts array to localStorage', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Saved Post',
          content: 'Saved content',
          date: '2024-01-15T00:00:00.000Z',
          authorId: 'user1',
          authorName: 'Test User',
          authorRole: 'user',
        },
      ];

      savePosts(mockPosts);

      const stored = localStorage.getItem('writespace_posts');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual(mockPosts);
    });

    it('overwrites existing posts in localStorage', () => {
      const initialPosts = [{ id: '1', title: 'Old Post' }];
      localStorage.setItem('writespace_posts', JSON.stringify(initialPosts));

      const newPosts = [{ id: '2', title: 'New Post' }];
      savePosts(newPosts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(newPosts);
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe('New Post');
    });

    it('saves an empty array to localStorage', () => {
      savePosts([]);

      const stored = localStorage.getItem('writespace_posts');
      expect(stored).toBe('[]');
    });

    it('does not throw when localStorage is unavailable', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage full');
      });

      expect(() => savePosts([{ id: '1' }])).not.toThrow();
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when no users exist in localStorage', () => {
      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('returns parsed users array from localStorage', () => {
      const mockUsers = [
        {
          id: 'user1',
          displayName: 'John Doe',
          username: 'johndoe',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-15T00:00:00.000Z',
        },
        {
          id: 'user2',
          displayName: 'Jane Admin',
          username: 'janeadmin',
          password: 'adminpass',
          role: 'admin',
          createdAt: '2024-01-10T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const users = getUsers();
      expect(users).toEqual(mockUsers);
      expect(users).toHaveLength(2);
      expect(users[0].username).toBe('johndoe');
      expect(users[1].role).toBe('admin');
    });

    it('returns an empty array when localStorage throws an error', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_users', '{{invalid json');

      const users = getUsers();
      expect(users).toEqual([]);
    });
  });

  describe('saveUsers', () => {
    it('saves users array to localStorage', () => {
      const mockUsers = [
        {
          id: 'user1',
          displayName: 'John Doe',
          username: 'johndoe',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-15T00:00:00.000Z',
        },
      ];

      saveUsers(mockUsers);

      const stored = localStorage.getItem('writespace_users');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual(mockUsers);
    });

    it('overwrites existing users in localStorage', () => {
      const initialUsers = [{ id: 'user1', username: 'old' }];
      localStorage.setItem('writespace_users', JSON.stringify(initialUsers));

      const newUsers = [{ id: 'user2', username: 'new' }];
      saveUsers(newUsers);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(newUsers);
      expect(stored).toHaveLength(1);
      expect(stored[0].username).toBe('new');
    });

    it('saves an empty array to localStorage', () => {
      saveUsers([]);

      const stored = localStorage.getItem('writespace_users');
      expect(stored).toBe('[]');
    });

    it('does not throw when localStorage is unavailable', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage full');
      });

      expect(() => saveUsers([{ id: 'user1' }])).not.toThrow();
    });
  });

  describe('data persistence round-trip', () => {
    it('persists posts through save and retrieve cycle', () => {
      const posts = [
        {
          id: 'post-1',
          title: 'Round Trip Post',
          content: 'This should persist',
          date: '2024-06-01T12:00:00.000Z',
          authorId: 'user-abc',
          authorName: 'Tester',
          authorRole: 'user',
        },
      ];

      savePosts(posts);
      const retrieved = getPosts();
      expect(retrieved).toEqual(posts);
    });

    it('persists users through save and retrieve cycle', () => {
      const users = [
        {
          id: 'user-abc',
          displayName: 'Round Trip User',
          username: 'roundtrip',
          password: 'secret',
          role: 'user',
          createdAt: '2024-06-01T12:00:00.000Z',
        },
      ];

      saveUsers(users);
      const retrieved = getUsers();
      expect(retrieved).toEqual(users);
    });

    it('posts and users are stored independently', () => {
      const posts = [{ id: 'p1', title: 'Post' }];
      const users = [{ id: 'u1', username: 'user' }];

      savePosts(posts);
      saveUsers(users);

      expect(getPosts()).toEqual(posts);
      expect(getUsers()).toEqual(users);

      savePosts([]);
      expect(getPosts()).toEqual([]);
      expect(getUsers()).toEqual(users);
    });
  });
});