import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { CnpgClusterImageCatalog, CnpgImageCatalog } from '../resources/cluster';

function getPgVersions(images: { major: number; image: string }[] | undefined): string {
  if (!images || images.length === 0) return 'None';
  return images
    .map(i => i.major)
    .sort((a, b) => b - a)
    .join(', ');
}

export function ImageCatalogListPage() {
  return (
    <ResourceListView
      title="CloudNativePG Image Catalogs"
      resourceClass={CnpgImageCatalog}
      columns={[
        { label: 'Name', getter: (c: any) => c.metadata.name },
        { label: 'Namespace', getter: (c: any) => c.metadata.namespace },
        {
          label: 'PG Versions',
          getter: (c: any) => getPgVersions(c.jsonData.spec?.images),
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
      resourceClass={CnpgClusterImageCatalog}
      columns={[
        { label: 'Name', getter: (c: any) => c.metadata.name },
        {
          label: 'PG Versions',
          getter: (c: any) => getPgVersions(c.jsonData.spec?.images),
        },
        { label: 'Image Count', getter: (c: any) => c.jsonData.spec?.images?.length ?? 0 },
        { label: 'Age', getter: (c: any) => c.getAge() },
      ]}
    />
  );
}
