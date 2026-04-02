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

interface MockCluster {
  metadata: { name: string; namespace: string };
  jsonData: {
    spec?: { instances?: number };
    status?: { currentPrimary?: string; readyInstances?: number; phase?: string };
  };
  getAge: () => string;
}

function getInstances(c: MockCluster) {
  return c.jsonData.spec?.instances;
}

function getCurrentPrimary(c: MockCluster) {
  return c.jsonData.status?.currentPrimary;
}

function getReadyInstances(c: MockCluster) {
  return c.jsonData.status?.readyInstances;
}

function getPhase(c: MockCluster) {
  return c.jsonData.status?.phase;
}

describe('ClusterList column getters', () => {
  describe('getInstances', () => {
    it('returns instance count when set', () => {
      const cluster: MockCluster = {
        metadata: { name: 'my-cluster', namespace: 'default' },
        jsonData: { spec: { instances: 3 } },
        getAge: () => '1d',
      };
      expect(getInstances(cluster)).toBe(3);
    });

    it('returns undefined when spec is missing', () => {
      const cluster: MockCluster = {
        metadata: { name: 'my-cluster', namespace: 'default' },
        jsonData: {},
        getAge: () => '1d',
      };
      expect(getInstances(cluster)).toBeUndefined();
    });
  });

  describe('getCurrentPrimary', () => {
    it('returns current primary when set', () => {
      const cluster: MockCluster = {
        metadata: { name: 'my-cluster', namespace: 'default' },
        jsonData: { status: { currentPrimary: 'my-cluster-1' } },
        getAge: () => '1d',
      };
      expect(getCurrentPrimary(cluster)).toBe('my-cluster-1');
    });

    it('returns undefined when status is missing', () => {
      const cluster: MockCluster = {
        metadata: { name: 'my-cluster', namespace: 'default' },
        jsonData: {},
        getAge: () => '1d',
      };
      expect(getCurrentPrimary(cluster)).toBeUndefined();
    });
  });

  describe('getReadyInstances', () => {
    it('returns ready instances count when set', () => {
      const cluster: MockCluster = {
        metadata: { name: 'my-cluster', namespace: 'default' },
        jsonData: { status: { readyInstances: 2 } },
        getAge: () => '1d',
      };
      expect(getReadyInstances(cluster)).toBe(2);
    });

    it('returns undefined when status is missing', () => {
      const cluster: MockCluster = {
        metadata: { name: 'my-cluster', namespace: 'default' },
        jsonData: {},
        getAge: () => '1d',
      };
      expect(getReadyInstances(cluster)).toBeUndefined();
    });
  });

  describe('getPhase', () => {
    it('returns phase when set', () => {
      const cluster: MockCluster = {
        metadata: { name: 'my-cluster', namespace: 'default' },
        jsonData: { status: { phase: 'Cluster in healthy state' } },
        getAge: () => '1d',
      };
      expect(getPhase(cluster)).toBe('Cluster in healthy state');
    });

    it('returns undefined when status is missing', () => {
      const cluster: MockCluster = {
        metadata: { name: 'my-cluster', namespace: 'default' },
        jsonData: {},
        getAge: () => '1d',
      };
      expect(getPhase(cluster)).toBeUndefined();
    });
  });
});
