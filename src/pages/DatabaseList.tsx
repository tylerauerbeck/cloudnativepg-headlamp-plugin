import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObjectClass } from '@kinvolk/headlamp-plugin/lib/lib/k8s/KubeObject';
import { CnpgDatabase } from '../resources/cluster';

export function DatabaseListPage() {
  return (
    <ResourceListView
      title="CloudNativePG Databases"
      resourceClass={CnpgDatabase as unknown as KubeObjectClass}
      columns={[
        { label: 'Name', getter: (c: any) => c.metadata.name },
        { label: 'Namespace', getter: (c: any) => c.metadata.namespace },
        { label: 'Cluster', getter: (c: any) => c.jsonData.spec?.cluster?.name },
        { label: 'DB Name', getter: (c: any) => c.jsonData.spec?.name },
        { label: 'Owner', getter: (c: any) => c.jsonData.spec?.owner },
        { label: 'Ready', getter: (c: any) => (c.jsonData.status?.ready ? 'Yes' : 'No') },
        { label: 'Age', getter: (c: any) => c.getAge() },
      ]}
    />
  );
}
