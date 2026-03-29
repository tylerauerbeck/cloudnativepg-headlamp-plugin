import { K8s } from '@kinvolk/headlamp-plugin/lib';
import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { CnpgPooler } from '../resources/cluster';

// const Pod = (window as any).pluginLib.K8s.ResourceClasses.Pod;
const Pod = K8s.ResourceClasses.Pod;

function useRunningPodCount(poolerName: string, namespace: string) {
  const [pods] = Pod.useList({ namespace, labelSelector: `cnpg.io/poolerName=${poolerName}` });

  if (!pods) return undefined;

  return pods.filter((p: any) => {
    const conditions = p.jsonData.status?.conditions ?? [];
    const ready = conditions.find((c: any) => c.type === 'Ready');
    return ready?.status === 'True';
  }).length;
}

function InstanceStatus({
  poolerName,
  namespace,
  requested,
}: {
  poolerName: string;
  namespace: string;
  requested: number;
}) {
  const running = useRunningPodCount(poolerName, namespace);

  if (requested === undefined) return <span>-</span>;
  if (running === undefined) return <span>{requested}</span>;

  const isHealthy = running === requested;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{
          display: 'inline-block',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: isHealthy ? '#2e7d32' : '#c62828',
          flexShrink: 0,
        }}
      />
      {`${running}/${requested}`}
    </span>
  );
}

export function PoolerListPage() {
  return (
    <ResourceListView
      title="CloudNativePG Poolers"
      resourceClass={CnpgPooler}
      columns={[
        { label: 'Name', getter: (c: any) => c.metadata.name },
        { label: 'Namespace', getter: (c: any) => c.metadata.namespace },
        { label: 'Cluster', getter: (c: any) => c.jsonData.spec?.cluster?.name },
        {
          label: 'Instances',
          getter: (c: any) => (
            <InstanceStatus
              poolerName={c.metadata.name}
              namespace={c.metadata.namespace}
              requested={c.jsonData.spec?.instances}
            />
          ),
        },
        { label: 'Type', getter: (c: any) => c.jsonData.spec?.type ?? '-' },
        { label: 'Pool Mode', getter: (c: any) => c.jsonData.spec?.pgbouncer?.poolMode ?? '-' },
        { label: 'Age', getter: (c: any) => c.getAge() },
      ]}
    />
  );
}
