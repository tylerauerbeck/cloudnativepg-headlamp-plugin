import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Tooltip } from '@mui/material';
import { CnpgBackup } from '../resources/cluster';

export function BackupListPage() {
  return (
    <ResourceListView
      title="CloudNativePG Backups"
      resourceClass={CnpgBackup}
      columns={[
        { label: 'Name', getter: (c: any) => c.metadata.name },
        { label: 'Namespace', getter: (c: any) => c.metadata.namespace },
        { label: 'Cluster', getter: (c: any) => c.jsonData.spec?.cluster?.name },
        { label: 'Method', getter: (c: any) => c.jsonData.spec?.method },
        {
          label: 'Phase',
          getter: (c: any) => {
            const phase = c.jsonData.status?.phase;
            const error = c.jsonData.status?.error;

            if (phase === 'failed' && error) {
              return (
                <Tooltip title={error} arrow>
                  <span style={{ cursor: 'help', textDecoration: 'underline dotted' }}>
                    {phase}
                  </span>
                </Tooltip>
              );
            }

            return phase ?? '-';
          },
        },
        { label: 'Started', getter: (c: any) => c.jsonData.status?.startedAt ?? '-' },
        { label: 'Stopped', getter: (c: any) => c.jsonData.status?.stoppedAt ?? '-' },
        { label: 'Age', getter: (c: any) => c.getAge() },
      ]}
    />
  );
}
