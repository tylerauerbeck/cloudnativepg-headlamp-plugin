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

interface MockFailoverQuorum {
  metadata: { name: string; namespace: string };
  jsonData: {
    spec?: { cluster?: { name?: string } };
    status?: { ready?: boolean };
  };
}

function getClusterName(c: MockFailoverQuorum) {
  return c.jsonData.spec?.cluster?.name;
}

function getReady(c: MockFailoverQuorum) {
  return c.jsonData.status?.ready ? 'Yes' : 'No';
}

describe('FailoverQuorumList column getters', () => {
  describe('getClusterName', () => {
    it('returns cluster name when set', () => {
      const fq: MockFailoverQuorum = {
        metadata: { name: 'my-fq', namespace: 'default' },
        jsonData: { spec: { cluster: { name: 'my-cluster' } } },
      };
      expect(getClusterName(fq)).toBe('my-cluster');
    });

    it('returns undefined when spec is missing', () => {
      const fq: MockFailoverQuorum = {
        metadata: { name: 'my-fq', namespace: 'default' },
        jsonData: {},
      };
      expect(getClusterName(fq)).toBeUndefined();
    });

    it('returns undefined when cluster is missing', () => {
      const fq: MockFailoverQuorum = {
        metadata: { name: 'my-fq', namespace: 'default' },
        jsonData: { spec: {} },
      };
      expect(getClusterName(fq)).toBeUndefined();
    });
  });

  describe('getReady', () => {
    it('returns Yes when ready is true', () => {
      const fq: MockFailoverQuorum = {
        metadata: { name: 'my-fq', namespace: 'default' },
        jsonData: { status: { ready: true } },
      };
      expect(getReady(fq)).toBe('Yes');
    });

    it('returns No when ready is false', () => {
      const fq: MockFailoverQuorum = {
        metadata: { name: 'my-fq', namespace: 'default' },
        jsonData: { status: { ready: false } },
      };
      expect(getReady(fq)).toBe('No');
    });

    it('returns No when status is missing', () => {
      const fq: MockFailoverQuorum = {
        metadata: { name: 'my-fq', namespace: 'default' },
        jsonData: {},
      };
      expect(getReady(fq)).toBe('No');
    });
  });
});
