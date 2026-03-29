import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Tooltip } from '@mui/material';
import { CnpgBackup, CnpgScheduledBackup } from '../resources/cluster';

function useLastBackup(scheduledBackupName: string, namespace: string) {
  const [backups] = CnpgBackup.useList({ namespace });

  if (!backups) return null;

  const owned = backups
    .filter((b: any) => b.metadata.labels?.['cnpg.io/scheduled-backup'] === scheduledBackupName)
    .sort((a: any, b: any) => {
      const aTime = new Date(a.jsonData.status?.stoppedAt ?? 0).getTime();
      const bTime = new Date(b.jsonData.status?.stoppedAt ?? 0).getTime();
      return bTime - aTime;
    });

  return owned[0] ?? null;
}

function useLastSuccessfulBackup(scheduledBackupName: string, namespace: string) {
  const [backups] = CnpgBackup.useList({ namespace });

  if (!backups) return '-';

  const owned = backups
    .filter(
      (b: any) =>
        b.metadata.labels?.['cnpg.io/scheduled-backup'] === scheduledBackupName &&
        b.jsonData.status?.phase === 'completed'
    )
    .sort((a: any, b: any) => {
      const aTime = new Date(a.jsonData.status?.stoppedAt ?? 0).getTime();
      const bTime = new Date(b.jsonData.status?.stoppedAt ?? 0).getTime();
      return bTime - aTime;
    });

  return owned[0]?.jsonData.status?.stoppedAt ?? '-';
}

function LastSuccess({ name, namespace }: { name: string; namespace: string }) {
  const lastSuccess = useLastSuccessfulBackup(name, namespace);
  return <span>{lastSuccess}</span>;
}

function StatusOrb({ phase }: { phase: string }) {
  const color = phase === 'completed' ? '#2e7d32' : phase === 'failed' ? '#c62828' : '#757575';

  return (
    <span
      style={{
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: color,
        marginRight: '8px',
        flexShrink: 0,
      }}
    />
  );
}

function LastRunChip({ name, namespace }: { name: string; namespace: string }) {
  const lastBackup = useLastBackup(name, namespace);

  if (!lastBackup) return <span>-</span>;

  const phase = lastBackup.jsonData.status?.phase;
  const stoppedAt = lastBackup.jsonData.status?.stoppedAt ?? '-';
  const error = lastBackup.jsonData.status?.error;
  const isFailed = phase === 'failed';

  const content = (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <StatusOrb phase={phase} />
      {stoppedAt}
    </span>
  );

  if (isFailed && error) {
    return (
      <Tooltip title={error} arrow>
        <span style={{ cursor: 'help', textDecoration: 'underline dotted' }}>{content}</span>
      </Tooltip>
    );
  }

  return content;
}

export function ScheduledBackupListPage() {
  return (
    <ResourceListView
      title="CloudNativePG Scheduled Backups"
      resourceClass={CnpgScheduledBackup}
      columns={[
        { label: 'Name', getter: (c: any) => c.metadata.name },
        { label: 'Namespace', getter: (c: any) => c.metadata.namespace },
        { label: 'Cluster', getter: (c: any) => c.jsonData.spec?.cluster?.name },
        { label: 'Schedule', getter: (c: any) => c.jsonData.spec?.schedule },
        { label: 'Last Schedule', getter: (c: any) => c.jsonData.status?.lastScheduleTime ?? '-' },
        {
          label: 'Last Success',
          getter: (c: any) => (
            <LastSuccess name={c.metadata.name} namespace={c.metadata.namespace} />
          ),
        },
        {
          label: 'Last Run',
          getter: (c: any) => (
            <LastRunChip name={c.metadata.name} namespace={c.metadata.namespace} />
          ),
        },
        { label: 'Age', getter: (c: any) => c.getAge() },
      ]}
    />
  );
}
