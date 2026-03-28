import { NameValueTable, SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { useParams } from 'react-router-dom';
import { CnpgCluster } from '../resources/cluster';

export function ClusterDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const [cluster, error] = CnpgCluster.useGet(name ?? '', namespace ?? '');

  if (error) return <div>Error: {error.message}</div>;
  if (!cluster) return <div>Loading...</div>;

  const spec = cluster.jsonData.spec;
  const status = cluster.jsonData.status;

  return (
    <SectionBox title={cluster.metadata.name}>
      <NameValueTable
        rows={[
          { name: 'Instances', value: spec?.instances },
          { name: 'Primary', value: status?.currentPrimary },
          { name: 'Ready Instances', value: status?.readyInstances },
          { name: 'Phase', value: status?.phase },
        ]}
      />
    </SectionBox>
  );
}
