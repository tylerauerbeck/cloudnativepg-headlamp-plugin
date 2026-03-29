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

vi.mock('@mui/material', () => ({
  Tooltip: ({ title, children }: { title: string; children: React.ReactElement }) => (
    <div data-testid="tooltip" data-title={title}>
      {children}
    </div>
  ),
}));

function PhaseCell({ phase, error }: { phase?: string; error?: string }) {
  const Tooltip = ({ title, children }: { title: string; children: React.ReactElement }) => (
    <div data-testid="tooltip" data-title={title}>
      {children}
    </div>
  );

  if (phase === 'failed' && error) {
    return (
      <Tooltip title={error}>
        <span style={{ cursor: 'help', textDecoration: 'underline dotted' }}>{phase}</span>
      </Tooltip>
    );
  }

  return <span>{phase ?? '-'}</span>;
}

describe('BackupList Phase Cell', () => {
  it('renders phase text when not failed', () => {
    render(<PhaseCell phase="completed" />);
    expect(screen.getByText('completed')).toBeTruthy();
  });

  it('renders dash when phase is undefined', () => {
    render(<PhaseCell />);
    expect(screen.getByText('-')).toBeTruthy();
  });

  it('renders tooltip when phase is failed and error exists', () => {
    render(<PhaseCell phase="failed" error="something went wrong" />);
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip.getAttribute('data-title')).toBe('something went wrong');
    expect(screen.getByText('failed')).toBeTruthy();
  });

  it('renders plain text when phase is failed but no error', () => {
    render(<PhaseCell phase="failed" />);
    expect(screen.queryByTestId('tooltip')).toBeNull();
    expect(screen.getByText('failed')).toBeTruthy();
  });
});
