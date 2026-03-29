import { describe, it, expect } from 'vitest';

// Extract the backup filtering and sorting logic for isolated testing
interface MockBackup {
  metadata: {
    labels?: Record<string, string>;
  };
  jsonData: {
    status?: {
      phase?: string;
      stoppedAt?: string;
    };
  };
}

function getLastBackup(backups: MockBackup[], scheduledBackupName: string): MockBackup | null {
  const owned = backups
    .filter(b => b.metadata.labels?.['cnpg.io/scheduled-backup'] === scheduledBackupName)
    .sort((a, b) => {
      const aTime = new Date(a.jsonData.status?.stoppedAt ?? 0).getTime();
      const bTime = new Date(b.jsonData.status?.stoppedAt ?? 0).getTime();
      return bTime - aTime;
    });

  return owned[0] ?? null;
}

function getLastSuccessfulBackup(backups: MockBackup[], scheduledBackupName: string): string {
  const owned = backups
    .filter(
      b =>
        b.metadata.labels?.['cnpg.io/scheduled-backup'] === scheduledBackupName &&
        b.jsonData.status?.phase === 'completed'
    )
    .sort((a, b) => {
      const aTime = new Date(a.jsonData.status?.stoppedAt ?? 0).getTime();
      const bTime = new Date(b.jsonData.status?.stoppedAt ?? 0).getTime();
      return bTime - aTime;
    });

  return owned[0]?.jsonData.status?.stoppedAt ?? '-';
}

const mockBackups: MockBackup[] = [
  {
    metadata: { labels: { 'cnpg.io/scheduled-backup': 'backup-example' } },
    jsonData: { status: { phase: 'completed', stoppedAt: '2026-03-29T00:15:00Z' } },
  },
  {
    metadata: { labels: { 'cnpg.io/scheduled-backup': 'backup-example' } },
    jsonData: { status: { phase: 'completed', stoppedAt: '2026-03-29T00:00:00Z' } },
  },
  {
    metadata: { labels: { 'cnpg.io/scheduled-backup': 'backup-example' } },
    jsonData: { status: { phase: 'failed', stoppedAt: '2026-03-29T00:30:00Z' } },
  },
  {
    metadata: { labels: { 'cnpg.io/scheduled-backup': 'other-backup' } },
    jsonData: { status: { phase: 'completed', stoppedAt: '2026-03-29T01:00:00Z' } },
  },
];

describe('ScheduledBackupList helpers', () => {
  describe('getLastBackup', () => {
    it('returns null when no backups exist', () => {
      expect(getLastBackup([], 'backup-example')).toBeNull();
    });

    it('returns null when no backups match the scheduled backup name', () => {
      expect(getLastBackup(mockBackups, 'nonexistent')).toBeNull();
    });

    it('returns the most recent backup regardless of phase', () => {
      const result = getLastBackup(mockBackups, 'backup-example');
      expect(result?.jsonData.status?.stoppedAt).toBe('2026-03-29T00:30:00Z');
    });

    it('does not return backups from other scheduled backups', () => {
      const result = getLastBackup(mockBackups, 'backup-example');
      expect(result?.jsonData.status?.stoppedAt).not.toBe('2026-03-29T01:00:00Z');
    });
  });

  describe('getLastSuccessfulBackup', () => {
    it('returns dash when no backups exist', () => {
      expect(getLastSuccessfulBackup([], 'backup-example')).toBe('-');
    });

    it('returns dash when no successful backups exist', () => {
      const failedOnly: MockBackup[] = [
        {
          metadata: { labels: { 'cnpg.io/scheduled-backup': 'backup-example' } },
          jsonData: { status: { phase: 'failed', stoppedAt: '2026-03-29T00:30:00Z' } },
        },
      ];
      expect(getLastSuccessfulBackup(failedOnly, 'backup-example')).toBe('-');
    });

    it('returns the most recent successful backup time', () => {
      const result = getLastSuccessfulBackup(mockBackups, 'backup-example');
      expect(result).toBe('2026-03-29T00:15:00Z');
    });

    it('ignores backups from other scheduled backups', () => {
      const result = getLastSuccessfulBackup(mockBackups, 'backup-example');
      expect(result).not.toBe('2026-03-29T01:00:00Z');
    });

    it('returns dash when no backups match the scheduled backup name', () => {
      expect(getLastSuccessfulBackup(mockBackups, 'nonexistent')).toBe('-');
    });
  });
});
