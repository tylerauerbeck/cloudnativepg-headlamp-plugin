import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { CnpgFailoverQuorum } from '../resources/cluster';

export function FailoverQuorumListPage() {
  return (
    <ResourceListView
      title="CloudNativePG Failover Quorums"
      resourceClass={CnpgFailoverQuorum}
      columns={[
        { label: 'Name', getter: (c: any) => c.metadata.name },
        { label: 'Namespace', getter: (c: any) => c.metadata.namespace },
        { label: 'Cluster', getter: (c: any) => c.jsonData.spec?.cluster?.name },
        { label: 'Ready', getter: (c: any) => (c.jsonData.status?.ready ? 'Yes' : 'No') },
        { label: 'Age', getter: (c: any) => c.getAge() },
      ]}
    />
  );
}
