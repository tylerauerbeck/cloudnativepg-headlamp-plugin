import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { CnpgCluster } from '../resources/cluster';

export function ClusterListPage() {
  return (
    <ResourceListView
      title="CloudNativePG Clusters"
      resourceClass={CnpgCluster}
      columns={[
        { label: 'Name', getter: (c: any) => c.metadata.name },
        { label: 'Namespace', getter: (c: any) => c.metadata.namespace },
        { label: 'Instances', getter: (c: any) => c.jsonData.spec?.instances },
        { label: 'Primary', getter: (c: any) => c.jsonData.status?.currentPrimary },
        { label: 'Ready', getter: (c: any) => c.jsonData.status?.readyInstances },
        { label: 'Phase', getter: (c: any) => c.jsonData.status?.phase },
        { label: 'Age', getter: (c: any) => c.getAge() },
      ]}
    />
  );
}
