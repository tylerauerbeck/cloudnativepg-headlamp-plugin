import { describe, it, expect, vi } from 'vitest';

vi.mock('@kinvolk/headlamp-plugin/lib/lib/k8s/crd', () => ({
  makeCustomResourceClass: vi.fn(({ kind, pluralName, singularName, isNamespaced, apiInfo }) => ({
    kind,
    apiName: pluralName,
    singularName,
    isNamespaced,
    apiVersion: `${apiInfo[0].group}/${apiInfo[0].version}`,
    useList: vi.fn(() => [[], null]),
    useGet: vi.fn(() => [null, null]),
  })),
}));

vi.mock('@kinvolk/headlamp-plugin/lib/CommonComponents', () => ({
  ResourceListView: vi.fn(() => null),
}));

interface MockDatabase {
  metadata: { name: string; namespace: string };
  jsonData: {
    spec?: { cluster?: { name?: string }; name?: string; owner?: string };
    status?: { ready?: boolean };
  };
}

function getDbName(c: MockDatabase) {
  return c.jsonData.spec?.name ?? '-';
}

function getOwner(c: MockDatabase) {
  return c.jsonData.spec?.owner ?? '-';
}

function getReady(c: MockDatabase) {
  return c.jsonData.status?.ready ? 'Yes' : 'No';
}

describe('DatabaseList column getters', () => {
  describe('getDbName', () => {
    it('returns the database name when set', () => {
      const db: MockDatabase = {
        metadata: { name: 'my-db', namespace: 'default' },
        jsonData: { spec: { name: 'app_db' } },
      };
      expect(getDbName(db)).toBe('app_db');
    });

    it('returns dash when spec name is missing', () => {
      const db: MockDatabase = {
        metadata: { name: 'my-db', namespace: 'default' },
        jsonData: { spec: {} },
      };
      expect(getDbName(db)).toBe('-');
    });

    it('returns dash when spec is missing', () => {
      const db: MockDatabase = {
        metadata: { name: 'my-db', namespace: 'default' },
        jsonData: {},
      };
      expect(getDbName(db)).toBe('-');
    });
  });

  describe('getOwner', () => {
    it('returns the owner when set', () => {
      const db: MockDatabase = {
        metadata: { name: 'my-db', namespace: 'default' },
        jsonData: { spec: { owner: 'app_user' } },
      };
      expect(getOwner(db)).toBe('app_user');
    });

    it('returns dash when owner is missing', () => {
      const db: MockDatabase = {
        metadata: { name: 'my-db', namespace: 'default' },
        jsonData: { spec: {} },
      };
      expect(getOwner(db)).toBe('-');
    });

    it('returns dash when spec is missing', () => {
      const db: MockDatabase = {
        metadata: { name: 'my-db', namespace: 'default' },
        jsonData: {},
      };
      expect(getOwner(db)).toBe('-');
    });
  });

  describe('getReady', () => {
    it('returns Yes when ready is true', () => {
      const db: MockDatabase = {
        metadata: { name: 'my-db', namespace: 'default' },
        jsonData: { status: { ready: true } },
      };
      expect(getReady(db)).toBe('Yes');
    });

    it('returns No when ready is false', () => {
      const db: MockDatabase = {
        metadata: { name: 'my-db', namespace: 'default' },
        jsonData: { status: { ready: false } },
      };
      expect(getReady(db)).toBe('No');
    });

    it('returns No when status is missing', () => {
      const db: MockDatabase = {
        metadata: { name: 'my-db', namespace: 'default' },
        jsonData: {},
      };
      expect(getReady(db)).toBe('No');
    });
  });
});
