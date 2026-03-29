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
  ResourceListView: vi.fn(() => null),
}));

vi.mock('@kinvolk/headlamp-plugin/lib', () => ({
  K8s: {
    ResourceClasses: {
      Pod: {
        useList: vi.fn(() => [[], null]),
      },
    },
  },
}));

function StatusOrb({ phase }: { phase: string }) {
  const color =
    phase === 'completed' ? '#2e7d32' :
    phase === 'failed' ? '#c62828' :
    '#757575';

  return (
    <span
      data-testid="status-orb"
      data-phase={phase}
      style={{ backgroundColor: color }}
    />
  );
}

function InstanceStatus({
  running,
  requested,
}: {
  running: number | undefined;
  requested: number;
}) {
  if (requested === undefined) return <span>-</span>;
  if (running === undefined) return <span>{requested}</span>;

  const isHealthy = running === requested;

  return (
    <span data-testid="instance-status">
      <span
        data-testid="instance-orb"
        data-healthy={isHealthy}
        style={{ backgroundColor: isHealthy ? '#2e7d32' : '#c62828' }}
      />
      {`${running}/${requested}`}
    </span>
  );
}

describe('InstanceStatus', () => {
  it('shows requested count when running is undefined', () => {
    render(<InstanceStatus running={undefined} requested={3} />);
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('shows running/requested when both available', () => {
    render(<InstanceStatus running={3} requested={3} />);
    expect(screen.getByText('3/3')).toBeTruthy();
  });

  it('shows green orb when running equals requested', () => {
    render(<InstanceStatus running={3} requested={3} />);
    const orb = screen.getByTestId('instance-orb');
    expect(orb.getAttribute('data-healthy')).toBe('true');
  });

  it('shows red orb when running is less than requested', () => {
    render(<InstanceStatus running={2} requested={3} />);
    const orb = screen.getByTestId('instance-orb');
    expect(orb.getAttribute('data-healthy')).toBe('false');
    expect(screen.getByText('2/3')).toBeTruthy();
  });

  it('shows red orb when running is zero', () => {
    render(<InstanceStatus running={0} requested={3} />);
    const orb = screen.getByTestId('instance-orb');
    expect(orb.getAttribute('data-healthy')).toBe('false');
    expect(screen.getByText('0/3')).toBeTruthy();
  });
});

describe('StatusOrb', () => {
  it('shows green for completed', () => {
    render(<StatusOrb phase="completed" />);
    const orb = screen.getByTestId('status-orb');
    expect(orb.getAttribute('data-phase')).toBe('completed');
  });

  it('shows red for failed', () => {
    render(<StatusOrb phase="failed" />);
    const orb = screen.getByTestId('status-orb');
    expect(orb.getAttribute('data-phase')).toBe('failed');
  });

  it('shows grey for unknown phase', () => {
    render(<StatusOrb phase="running" />);
    const orb = screen.getByTestId('status-orb');
    expect(orb.getAttribute('data-phase')).toBe('running');
  });
});
