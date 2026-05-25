import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSession, setSession, clearSession } from './auth';

describe('auth utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns parsed session object from localStorage', () => {
      const mockSession = {
        userId: 'user1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      const session = getSession();
      expect(session).toEqual(mockSession);
      expect(session.userId).toBe('user1');
      expect(session.username).toBe('johndoe');
      expect(session.displayName).toBe('John Doe');
      expect(session.role).toBe('user');
    });

    it('returns admin session object correctly', () => {
      const mockSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      const session = getSession();
      expect(session).toEqual(mockSession);
      expect(session.role).toBe('admin');
    });

    it('returns null when localStorage throws an error', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_session', 'not valid json{{{');

      const session = getSession();
      expect(session).toBeNull();
    });
  });

  describe('setSession', () => {
    it('saves session object to localStorage', () => {
      const mockSession = {
        userId: 'user1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      };

      setSession(mockSession);

      const stored = localStorage.getItem('writespace_session');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual(mockSession);
    });

    it('saves admin session object to localStorage', () => {
      const mockSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };

      setSession(mockSession);

      const stored = localStorage.getItem('writespace_session');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual(mockSession);
    });

    it('overwrites existing session in localStorage', () => {
      const initialSession = {
        userId: 'user1',
        username: 'old',
        displayName: 'Old User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(initialSession));

      const newSession = {
        userId: 'user2',
        username: 'new',
        displayName: 'New User',
        role: 'admin',
      };
      setSession(newSession);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(newSession);
      expect(stored.userId).toBe('user2');
      expect(stored.username).toBe('new');
    });

    it('does not throw when localStorage is unavailable', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage full');
      });

      expect(() =>
        setSession({
          userId: 'user1',
          username: 'johndoe',
          displayName: 'John Doe',
          role: 'user',
        })
      ).not.toThrow();
    });
  });

  describe('clearSession', () => {
    it('removes session from localStorage', () => {
      const mockSession = {
        userId: 'user1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      clearSession();

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('does not throw when localStorage is unavailable', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      expect(() => clearSession()).not.toThrow();
    });
  });

  describe('session round-trip', () => {
    it('persists session through setSession and getSession cycle', () => {
      const session = {
        userId: 'user-abc',
        username: 'roundtrip',
        displayName: 'Round Trip User',
        role: 'user',
      };

      setSession(session);
      const retrieved = getSession();
      expect(retrieved).toEqual(session);
    });

    it('returns null after setSession followed by clearSession', () => {
      const session = {
        userId: 'user-abc',
        username: 'roundtrip',
        displayName: 'Round Trip User',
        role: 'user',
      };

      setSession(session);
      expect(getSession()).toEqual(session);

      clearSession();
      expect(getSession()).toBeNull();
    });

    it('session storage is independent from posts and users storage', () => {
      const session = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      const posts = [{ id: 'p1', title: 'Post' }];

      setSession(session);
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      expect(getSession()).toEqual(session);

      clearSession();
      expect(getSession()).toBeNull();
      expect(JSON.parse(localStorage.getItem('writespace_posts'))).toEqual(posts);
    });
  });
});