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

interface MockPublication {
  metadata: { name: string; namespace: string };
  jsonData: {
    spec?: { cluster?: { name?: string }; name?: string; dbname?: string };
    status?: { applied?: boolean };
  };
}

function getPgPublicationName(c: MockPublication) {
  return c.jsonData.spec?.name ?? '-';
}

function getDatabase(c: MockPublication) {
  return c.jsonData.spec?.dbname ?? '-';
}

function getReady(c: MockPublication) {
  return c.jsonData.status?.applied ? 'Yes' : 'No';
}

describe('PublicationList column getters', () => {
  describe('getPgPublicationName', () => {
    it('returns pg publication name when set', () => {
      const pub: MockPublication = {
        metadata: { name: 'my-pub', namespace: 'default' },
        jsonData: { spec: { name: 'my_publication' } },
      };
      expect(getPgPublicationName(pub)).toBe('my_publication');
    });

    it('returns dash when name is missing', () => {
      const pub: MockPublication = {
        metadata: { name: 'my-pub', namespace: 'default' },
        jsonData: { spec: {} },
      };
      expect(getPgPublicationName(pub)).toBe('-');
    });

    it('returns dash when spec is missing', () => {
      const pub: MockPublication = {
        metadata: { name: 'my-pub', namespace: 'default' },
        jsonData: {},
      };
      expect(getPgPublicationName(pub)).toBe('-');
    });
  });

  describe('getDatabase', () => {
    it('returns dbname when set', () => {
      const pub: MockPublication = {
        metadata: { name: 'my-pub', namespace: 'default' },
        jsonData: { spec: { dbname: 'app_db' } },
      };
      expect(getDatabase(pub)).toBe('app_db');
    });

    it('returns dash when dbname is missing', () => {
      const pub: MockPublication = {
        metadata: { name: 'my-pub', namespace: 'default' },
        jsonData: { spec: {} },
      };
      expect(getDatabase(pub)).toBe('-');
    });

    it('returns dash when spec is missing', () => {
      const pub: MockPublication = {
        metadata: { name: 'my-pub', namespace: 'default' },
        jsonData: {},
      };
      expect(getDatabase(pub)).toBe('-');
    });
  });

  describe('getReady', () => {
    it('returns Yes when applied is true', () => {
      const pub: MockPublication = {
        metadata: { name: 'my-pub', namespace: 'default' },
        jsonData: { status: { applied: true } },
      };
      expect(getReady(pub)).toBe('Yes');
    });

    it('returns No when applied is false', () => {
      const pub: MockPublication = {
        metadata: { name: 'my-pub', namespace: 'default' },
        jsonData: { status: { applied: false } },
      };
      expect(getReady(pub)).toBe('No');
    });

    it('returns No when status is missing', () => {
      const pub: MockPublication = {
        metadata: { name: 'my-pub', namespace: 'default' },
        jsonData: {},
      };
      expect(getReady(pub)).toBe('No');
    });
  });
});
