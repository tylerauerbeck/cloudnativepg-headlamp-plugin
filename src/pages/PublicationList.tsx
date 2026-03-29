import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { CnpgPublication } from '../resources/cluster';

export function PublicationListPage() {
  return (
    <ResourceListView
      title="CloudNativePG Publications"
      resourceClass={CnpgPublication}
      columns={[
        { label: 'Name', getter: (c: any) => c.metadata.name },
        { label: 'Namespace', getter: (c: any) => c.metadata.namespace },
        { label: 'Cluster', getter: (c: any) => c.jsonData.spec?.cluster?.name },
        { label: 'PG Publication Name', getter: (c: any) => c.jsonData.spec?.name ?? '-' },
        { label: 'Database', getter: (c: any) => c.jsonData.spec?.dbname ?? '-' },
        { label: 'Ready', getter: (c: any) => (c.jsonData.status?.applied ? 'Yes' : 'No') },
        { label: 'Age', getter: (c: any) => c.getAge() },
      ]}
    />
  );
}
