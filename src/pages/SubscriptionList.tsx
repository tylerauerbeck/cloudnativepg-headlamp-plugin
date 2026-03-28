import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObjectClass } from '@kinvolk/headlamp-plugin/lib/lib/k8s/KubeObject';
import { CnpgSubscription } from '../resources/cluster';

export function SubscriptionListPage() {
  return (
    <ResourceListView
      title="CloudNativePG Subscriptions"
      resourceClass={CnpgSubscription as unknown as KubeObjectClass}
      columns={[
        { label: 'Name', getter: (c: any) => c.metadata.name },
        { label: 'Namespace', getter: (c: any) => c.metadata.namespace },
        { label: 'Cluster', getter: (c: any) => c.jsonData.spec?.cluster?.name },
        { label: 'DB Name', getter: (c: any) => c.jsonData.spec?.dbname },
        { label: 'Publication', getter: (c: any) => c.jsonData.spec?.publicationName },
        { label: 'Ready', getter: (c: any) => (c.jsonData.status?.applied ? 'Yes' : 'No') },
        { label: 'Age', getter: (c: any) => c.getAge() },
      ]}
    />
  );
}
