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

import {
  CnpgCluster,
  CnpgBackup,
  CnpgScheduledBackup,
  CnpgPooler,
  CnpgDatabase,
  CnpgPublication,
  CnpgSubscription,
  CnpgImageCatalog,
  CnpgClusterImageCatalog,
  CnpgFailoverQuorum,
} from './cluster';

describe('CNPG Resource Classes', () => {
  describe('CnpgCluster', () => {
    it('has correct apiVersion', () => {
      expect(CnpgCluster.apiVersion).toBe('postgresql.cnpg.io/v1');
    });
    it('has correct kind', () => {
      expect(CnpgCluster.kind).toBe('Cluster');
    });
    it('has correct apiName', () => {
      expect(CnpgCluster.apiName).toBe('clusters');
    });
    it('is namespaced', () => {
      expect(CnpgCluster.isNamespaced).toBe(true);
    });
  });

  describe('CnpgBackup', () => {
    it('has correct apiVersion', () => {
      expect(CnpgBackup.apiVersion).toBe('postgresql.cnpg.io/v1');
    });
    it('has correct kind', () => {
      expect(CnpgBackup.kind).toBe('Backup');
    });
    it('has correct apiName', () => {
      expect(CnpgBackup.apiName).toBe('backups');
    });
    it('is namespaced', () => {
      expect(CnpgBackup.isNamespaced).toBe(true);
    });
  });

  describe('CnpgScheduledBackup', () => {
    it('has correct kind', () => {
      expect(CnpgScheduledBackup.kind).toBe('ScheduledBackup');
    });
    it('has correct apiName', () => {
      expect(CnpgScheduledBackup.apiName).toBe('scheduledbackups');
    });
    it('is namespaced', () => {
      expect(CnpgScheduledBackup.isNamespaced).toBe(true);
    });
  });

  describe('CnpgPooler', () => {
    it('has correct kind', () => {
      expect(CnpgPooler.kind).toBe('Pooler');
    });
    it('has correct apiName', () => {
      expect(CnpgPooler.apiName).toBe('poolers');
    });
    it('is namespaced', () => {
      expect(CnpgPooler.isNamespaced).toBe(true);
    });
  });

  describe('CnpgDatabase', () => {
    it('has correct kind', () => {
      expect(CnpgDatabase.kind).toBe('Database');
    });
    it('has correct apiName', () => {
      expect(CnpgDatabase.apiName).toBe('databases');
    });
    it('is namespaced', () => {
      expect(CnpgDatabase.isNamespaced).toBe(true);
    });
  });

  describe('CnpgPublication', () => {
    it('has correct kind', () => {
      expect(CnpgPublication.kind).toBe('Publication');
    });
    it('has correct apiName', () => {
      expect(CnpgPublication.apiName).toBe('publications');
    });
    it('is namespaced', () => {
      expect(CnpgPublication.isNamespaced).toBe(true);
    });
  });

  describe('CnpgSubscription', () => {
    it('has correct kind', () => {
      expect(CnpgSubscription.kind).toBe('Subscription');
    });
    it('has correct apiName', () => {
      expect(CnpgSubscription.apiName).toBe('subscriptions');
    });
    it('is namespaced', () => {
      expect(CnpgSubscription.isNamespaced).toBe(true);
    });
  });

  describe('CnpgImageCatalog', () => {
    it('has correct kind', () => {
      expect(CnpgImageCatalog.kind).toBe('ImageCatalog');
    });
    it('has correct apiName', () => {
      expect(CnpgImageCatalog.apiName).toBe('imagecatalogs');
    });
    it('is namespaced', () => {
      expect(CnpgImageCatalog.isNamespaced).toBe(true);
    });
  });

  describe('CnpgClusterImageCatalog', () => {
    it('has correct kind', () => {
      expect(CnpgClusterImageCatalog.kind).toBe('ClusterImageCatalog');
    });
    it('has correct apiName', () => {
      expect(CnpgClusterImageCatalog.apiName).toBe('clusterimagecatalogs');
    });
    it('is NOT namespaced', () => {
      expect(CnpgClusterImageCatalog.isNamespaced).toBe(false);
    });
  });

  describe('CnpgFailoverQuorum', () => {
    it('has correct kind', () => {
      expect(CnpgFailoverQuorum.kind).toBe('FailoverQuorum');
    });
    it('has correct apiName', () => {
      expect(CnpgFailoverQuorum.apiName).toBe('failoverquorums');
    });
    it('is namespaced', () => {
      expect(CnpgFailoverQuorum.isNamespaced).toBe(true);
    });
  });
});
