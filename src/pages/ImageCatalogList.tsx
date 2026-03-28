import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { KubeObjectClass } from '@kinvolk/headlamp-plugin/lib/lib/k8s/KubeObject';
import { CnpgClusterImageCatalog, CnpgImageCatalog } from '../resources/cluster';

export function ImageCatalogListPage() {
  return (
    <ResourceListView
      title="CloudNativePG Image Catalogs"
      resourceClass={CnpgImageCatalog as unknown as KubeObjectClass}
      columns={[
        { label: 'Name', getter: (c: any) => c.metadata.name },
        { label: 'Namespace', getter: (c: any) => c.metadata.namespace },
        {
          label: 'PG Versions',
          getter: (c: any) =>
            c.jsonData.spec?.images
              ?.map((i: any) => i.major)
              .sort((a: number, b: number) => b - a)
              .join(', ') ?? 'None',
        },
        { label: 'Image Count', getter: (c: any) => c.jsonData.spec?.images?.length ?? 0 },
        { label: 'Age', getter: (c: any) => c.getAge() },
      ]}
    />
  );
}

export function ClusterImageCatalogListPage() {
  return (
    <ResourceListView
      title="CloudNativePG Cluster Image Catalogs"
      resourceClass={CnpgClusterImageCatalog as unknown as KubeObjectClass}
      columns={[
        { label: 'Name', getter: (c: any) => c.metadata.name },
        {
          label: 'PG Versions',
          getter: (c: any) =>
            c.jsonData.spec?.images
              ?.map((i: any) => i.major)
              .sort((a: number, b: number) => b - a)
              .join(', ') ?? 'None',
        },
        { label: 'Image Count', getter: (c: any) => c.jsonData.spec?.images?.length ?? 0 },
        { label: 'Age', getter: (c: any) => c.getAge() },
      ]}
    />
  );
}
