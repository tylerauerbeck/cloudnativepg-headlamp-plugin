import {
  DetailsViewSectionProps,
  registerDetailsViewSection,
  registerRoute,
  registerSidebarEntry,
} from '@kinvolk/headlamp-plugin/lib';
import { SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { BackupListPage } from './pages/BackupList';
import { ClusterDetailPage } from './pages/ClusterDetail';
import { ClusterListPage } from './pages/ClusterList';
import { DatabaseListPage } from './pages/DatabaseList';
import { FailoverQuorumListPage } from './pages/FailoverQuorumList';
import { ClusterImageCatalogListPage, ImageCatalogListPage } from './pages/ImageCatalogList';
import { PoolerListPage } from './pages/PoolerList';
import { PublicationListPage } from './pages/PublicationList';
import { ScheduledBackupListPage } from './pages/ScheduledBackupList';
import { SubscriptionListPage } from './pages/SubscriptionList';

// Sidebar parent
registerSidebarEntry({
  parent: null,
  name: 'cnpg',
  label: 'CloudNativePG',
  icon: 'mdi:database',
  url: '/cnpg/clusters',
});

// Sidebar children
registerSidebarEntry({
  parent: 'cnpg',
  name: 'cnpg-clusters',
  label: 'Clusters',
  url: '/cnpg/clusters',
});
registerSidebarEntry({
  parent: 'cnpg',
  name: 'cnpg-backups',
  label: 'Backups',
  url: '/cnpg/backups',
});
registerSidebarEntry({
  parent: 'cnpg',
  name: 'cnpg-scheduled-backups',
  label: 'Scheduled Backups',
  url: '/cnpg/scheduledbackups',
});
registerSidebarEntry({
  parent: 'cnpg',
  name: 'cnpg-poolers',
  label: 'Poolers',
  url: '/cnpg/poolers',
});
// registerSidebarEntry({
//   parent: 'cnpg',
//   name: 'cnpg-databases',
//   label: 'Databases',
//   url: '/cnpg/databases',
// });
registerSidebarEntry({
  parent: 'cnpg',
  name: 'cnpg-publications',
  label: 'Publications',
  url: '/cnpg/publications',
});
registerSidebarEntry({
  parent: 'cnpg',
  name: 'cnpg-subscriptions',
  label: 'Subscriptions',
  url: '/cnpg/subscriptions',
});
registerSidebarEntry({
  parent: 'cnpg',
  name: 'cnpg-imagecatalogs',
  label: 'Image Catalogs',
  url: '/cnpg/imagecatalogs',
});
registerSidebarEntry({
  parent: 'cnpg',
  name: 'cnpg-clusterimagecatalogs',
  label: 'Cluster Image Catalogs',
  url: '/cnpg/clusterimagecatalogs',
});
// registerSidebarEntry({
//   parent: 'cnpg',
//   name: 'cnpg-failoverquorums',
//   label: 'Failover Quorums',
//   url: '/cnpg/failoverquorums',
// });

// Routes
registerRoute({ path: '/cnpg/clusters', component: ClusterListPage, sidebar: 'cnpg-clusters' });
registerRoute({
  path: '/cnpg/clusters/:namespace/:name',
  component: ClusterDetailPage,
  sidebar: 'cnpg-clusters',
});
registerRoute({ path: '/cnpg/backups', component: BackupListPage, sidebar: 'cnpg-backups' });
registerRoute({
  path: '/cnpg/scheduledbackups',
  component: ScheduledBackupListPage,
  sidebar: 'cnpg-scheduled-backups',
});
registerRoute({ path: '/cnpg/poolers', component: PoolerListPage, sidebar: 'cnpg-poolers' });
registerRoute({ path: '/cnpg/databases', component: DatabaseListPage, sidebar: 'cnpg-databases' });
registerRoute({
  path: '/cnpg/publications',
  component: PublicationListPage,
  sidebar: 'cnpg-publications',
});
registerRoute({
  path: '/cnpg/subscriptions',
  component: SubscriptionListPage,
  sidebar: 'cnpg-subscriptions',
});
registerRoute({
  path: '/cnpg/imagecatalogs',
  component: ImageCatalogListPage,
  sidebar: 'cnpg-imagecatalogs',
});
registerRoute({
  path: '/cnpg/clusterimagecatalogs',
  component: ClusterImageCatalogListPage,
  sidebar: 'cnpg-clusterimagecatalogs',
});
registerRoute({
  path: '/cnpg/failoverquorums',
  component: FailoverQuorumListPage,
  sidebar: 'cnpg-failoverquorums',
});

// Pod detail enrichment
registerDetailsViewSection(({ resource }: DetailsViewSectionProps) => {
  if (resource?.kind !== 'Pod') return null;
  const clusterName = resource?.metadata?.labels?.['cnpg.io/cluster'];
  if (!clusterName) return null;
  return (
    <SectionBox title="CloudNativePG">
      <p>
        Cluster: <strong>{clusterName}</strong>
      </p>
      <p>Role: {resource?.metadata?.labels?.['cnpg.io/instanceRole']}</p>
    </SectionBox>
  );
});
