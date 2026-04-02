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

interface MockSubscription {
  metadata: { name: string; namespace: string };
  jsonData: {
    spec?: { cluster?: { name?: string }; dbname?: string; publicationName?: string };
    status?: { applied?: boolean };
  };
}

function getDbName(c: MockSubscription) {
  return c.jsonData.spec?.dbname ?? '-';
}

function getPublicationName(c: MockSubscription) {
  return c.jsonData.spec?.publicationName ?? '-';
}

function getReady(c: MockSubscription) {
  return c.jsonData.status?.applied ? 'Yes' : 'No';
}

describe('SubscriptionList column getters', () => {
  describe('getDbName', () => {
    it('returns dbname when set', () => {
      const sub: MockSubscription = {
        metadata: { name: 'my-sub', namespace: 'default' },
        jsonData: { spec: { dbname: 'app_db' } },
      };
      expect(getDbName(sub)).toBe('app_db');
    });

    it('returns dash when dbname is missing', () => {
      const sub: MockSubscription = {
        metadata: { name: 'my-sub', namespace: 'default' },
        jsonData: { spec: {} },
      };
      expect(getDbName(sub)).toBe('-');
    });

    it('returns dash when spec is missing', () => {
      const sub: MockSubscription = {
        metadata: { name: 'my-sub', namespace: 'default' },
        jsonData: {},
      };
      expect(getDbName(sub)).toBe('-');
    });
  });

  describe('getPublicationName', () => {
    it('returns publication name when set', () => {
      const sub: MockSubscription = {
        metadata: { name: 'my-sub', namespace: 'default' },
        jsonData: { spec: { publicationName: 'my_publication' } },
      };
      expect(getPublicationName(sub)).toBe('my_publication');
    });

    it('returns dash when publicationName is missing', () => {
      const sub: MockSubscription = {
        metadata: { name: 'my-sub', namespace: 'default' },
        jsonData: { spec: {} },
      };
      expect(getPublicationName(sub)).toBe('-');
    });

    it('returns dash when spec is missing', () => {
      const sub: MockSubscription = {
        metadata: { name: 'my-sub', namespace: 'default' },
        jsonData: {},
      };
      expect(getPublicationName(sub)).toBe('-');
    });
  });

  describe('getReady', () => {
    it('returns Yes when applied is true', () => {
      const sub: MockSubscription = {
        metadata: { name: 'my-sub', namespace: 'default' },
        jsonData: { status: { applied: true } },
      };
      expect(getReady(sub)).toBe('Yes');
    });

    it('returns No when applied is false', () => {
      const sub: MockSubscription = {
        metadata: { name: 'my-sub', namespace: 'default' },
        jsonData: { status: { applied: false } },
      };
      expect(getReady(sub)).toBe('No');
    });

    it('returns No when status is missing', () => {
      const sub: MockSubscription = {
        metadata: { name: 'my-sub', namespace: 'default' },
        jsonData: {},
      };
      expect(getReady(sub)).toBe('No');
    });
  });
});
