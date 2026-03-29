import { makeCustomResourceClass } from '@kinvolk/headlamp-plugin/lib/lib/k8s/crd';

const GROUP = 'postgresql.cnpg.io';
const VERSION = 'v1';

export const CnpgCluster = makeCustomResourceClass({
  apiInfo: [{ group: GROUP, version: VERSION }],
  isNamespaced: true,
  singularName: 'Cluster',
  pluralName: 'clusters',
  kind: 'Cluster',
});

export const CnpgBackup = makeCustomResourceClass({
  apiInfo: [{ group: GROUP, version: VERSION }],
  isNamespaced: true,
  singularName: 'Backup',
  pluralName: 'backups',
  kind: 'Backup',
});

export const CnpgScheduledBackup = makeCustomResourceClass({
  apiInfo: [{ group: GROUP, version: VERSION }],
  isNamespaced: true,
  singularName: 'ScheduledBackup',
  pluralName: 'scheduledbackups',
  kind: 'ScheduledBackup',
});

export const CnpgPooler = makeCustomResourceClass({
  apiInfo: [{ group: GROUP, version: VERSION }],
  isNamespaced: true,
  singularName: 'Pooler',
  pluralName: 'poolers',
  kind: 'Pooler',
});

export const CnpgDatabase = makeCustomResourceClass({
  apiInfo: [{ group: GROUP, version: VERSION }],
  isNamespaced: true,
  singularName: 'Database',
  pluralName: 'databases',
  kind: 'Database',
});

export const CnpgPublication = makeCustomResourceClass({
  apiInfo: [{ group: GROUP, version: VERSION }],
  isNamespaced: true,
  singularName: 'Publication',
  pluralName: 'publications',
  kind: 'Publication',
});

export const CnpgSubscription = makeCustomResourceClass({
  apiInfo: [{ group: GROUP, version: VERSION }],
  isNamespaced: true,
  singularName: 'Subscription',
  pluralName: 'subscriptions',
  kind: 'Subscription',
});

export const CnpgImageCatalog = makeCustomResourceClass({
  apiInfo: [{ group: GROUP, version: VERSION }],
  isNamespaced: true,
  singularName: 'ImageCatalog',
  pluralName: 'imagecatalogs',
  kind: 'ImageCatalog',
});

export const CnpgClusterImageCatalog = makeCustomResourceClass({
  apiInfo: [{ group: GROUP, version: VERSION }],
  isNamespaced: false,
  singularName: 'ClusterImageCatalog',
  pluralName: 'clusterimagecatalogs',
  kind: 'ClusterImageCatalog',
});

export const CnpgFailoverQuorum = makeCustomResourceClass({
  apiInfo: [{ group: GROUP, version: VERSION }],
  isNamespaced: true,
  singularName: 'FailoverQuorum',
  pluralName: 'failoverquorums',
  kind: 'FailoverQuorum',
});