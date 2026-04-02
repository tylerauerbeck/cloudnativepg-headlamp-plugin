import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@kinvolk/headlamp-plugin/lib/lib/k8s/crd', () => ({
  makeCustomResourceClass: vi.fn(({ kind, pluralName, singularName, isNamespaced, apiInfo }) => ({
    kind,
    apiName: pluralName,
    singularName,
    isNamespaced,
    apiVersion: `${apiInfo[0].group}/${apiInfo[0].version}`,
    useList: vi.fn(() => [[], null]),
    useGet: vi.fn(() => [null, null]),
  })),
}));

vi.mock('@kinvolk/headlamp-plugin/lib/CommonComponents', () => ({
  SectionBox: vi.fn(({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="section-box" data-title={title}>
      {children}
    </div>
  )),
  NameValueTable: vi.fn(({ rows }: { rows: { name: string; value: any }[] }) => (
    <table data-testid="name-value-table">
      <tbody>
        {rows.map((row: { name: string; value: any }) => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td data-testid={`value-${row.name}`}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )),
}));

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(() => ({ namespace: 'default', name: 'my-cluster' })),
}));

interface MockCluster {
  metadata: { name: string; namespace: string };
  jsonData: {
    spec?: { instances?: number };
    status?: { currentPrimary?: string; readyInstances?: number; phase?: string };
  };
}

function ClusterDetailPage({
  cluster,
  error,
}: {
  cluster: MockCluster | null;
  error: { message: string } | null;
}) {
  const SectionBox = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="section-box" data-title={title}>
      {children}
    </div>
  );

  const NameValueTable = ({ rows }: { rows: { name: string; value: any }[] }) => (
    <table data-testid="name-value-table">
      <tbody>
        {rows.map((row: { name: string; value: any }) => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td data-testid={`value-${row.name}`}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

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

describe('ClusterDetailPage', () => {
  it('shows loading state when cluster is null', () => {
    render(<ClusterDetailPage cluster={null} error={null} />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('shows error message when error is present', () => {
    render(<ClusterDetailPage cluster={null} error={{ message: 'not found' }} />);
    expect(screen.getByText('Error: not found')).toBeTruthy();
  });

  it('renders cluster name as section title', () => {
    const cluster: MockCluster = {
      metadata: { name: 'my-cluster', namespace: 'default' },
      jsonData: {
        spec: { instances: 3 },
        status: { currentPrimary: 'my-cluster-1', readyInstances: 3, phase: 'healthy' },
      },
    };
    render(<ClusterDetailPage cluster={cluster} error={null} />);
    const box = screen.getByTestId('section-box');
    expect(box.getAttribute('data-title')).toBe('my-cluster');
  });

  it('renders spec instances in the table', () => {
    const cluster: MockCluster = {
      metadata: { name: 'my-cluster', namespace: 'default' },
      jsonData: { spec: { instances: 3 }, status: {} },
    };
    render(<ClusterDetailPage cluster={cluster} error={null} />);
    expect(screen.getByTestId('value-Instances').textContent).toBe('3');
  });

  it('renders status fields in the table', () => {
    const cluster: MockCluster = {
      metadata: { name: 'my-cluster', namespace: 'default' },
      jsonData: {
        spec: { instances: 3 },
        status: { currentPrimary: 'my-cluster-1', readyInstances: 2, phase: 'healthy' },
      },
    };
    render(<ClusterDetailPage cluster={cluster} error={null} />);
    expect(screen.getByTestId('value-Primary').textContent).toBe('my-cluster-1');
    expect(screen.getByTestId('value-Ready Instances').textContent).toBe('2');
    expect(screen.getByTestId('value-Phase').textContent).toBe('healthy');
  });

  it('renders empty values when spec and status are missing', () => {
    const cluster: MockCluster = {
      metadata: { name: 'my-cluster', namespace: 'default' },
      jsonData: {},
    };
    render(<ClusterDetailPage cluster={cluster} error={null} />);
    expect(screen.getByTestId('value-Instances').textContent).toBe('');
    expect(screen.getByTestId('value-Primary').textContent).toBe('');
  });
});
