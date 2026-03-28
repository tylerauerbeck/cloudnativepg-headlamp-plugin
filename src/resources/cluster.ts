import { KubeObjectInterface } from '@kinvolk/headlamp-plugin/lib/lib/k8s/KubeObject';

const KubeObject = Object.getPrototypeOf((window as any).pluginLib.K8s.ResourceClasses.Pod);

// Cluster
export interface CnpgClusterSpec {
  instances: number;
  imageName?: string;
  storage: { size: string };
}
export interface CnpgClusterStatus {
  currentPrimary?: string;
  readyInstances?: number;
  phase?: string;
  lastSuccessfulArchiveTime?: string;
}
export interface CnpgClusterInterface extends KubeObjectInterface {
  spec: CnpgClusterSpec;
  status: CnpgClusterStatus;
}
export class CnpgCluster extends KubeObject {
  static readonly apiVersion = 'postgresql.cnpg.io/v1';
  static readonly isNamespaced = true;
  static readonly kind = 'Cluster';
  static readonly apiName = 'clusters';
}

// Backup
export interface CnpgBackupSpec {
  cluster: { name: string };
  method?: string;
}
export interface CnpgBackupStatus {
  phase?: string;
  startedAt?: string;
  stoppedAt?: string;
  backupId?: string;
}
export interface CnpgBackupInterface extends KubeObjectInterface {
  spec: CnpgBackupSpec;
  status: CnpgBackupStatus;
}
export class CnpgBackup extends KubeObject {
  static readonly apiVersion = 'postgresql.cnpg.io/v1';
  static readonly isNamespaced = true;
  static readonly kind = 'Backup';
  static readonly apiName = 'backups';
}

// ScheduledBackup
export interface CnpgScheduledBackupSpec {
  cluster: { name: string };
  schedule?: string;
  backupOwnerReference?: string;
}
export interface CnpgScheduledBackupStatus {
  lastScheduleTime?: string;
  lastSuccessfulTime?: string;
}
export interface CnpgScheduledBackupInterface extends KubeObjectInterface {
  spec: CnpgScheduledBackupSpec;
  status: CnpgScheduledBackupStatus;
}
export class CnpgScheduledBackup extends KubeObject {
  static readonly apiVersion = 'postgresql.cnpg.io/v1';
  static readonly isNamespaced = true;
  static readonly kind = 'ScheduledBackup';
  static readonly apiName = 'scheduledbackups';
}

// Pooler
export interface CnpgPoolerSpec {
  cluster: { name: string };
  instances?: number;
  type?: string;
  pgbouncer?: { poolMode?: string };
}
export interface CnpgPoolerStatus {
  instances?: number;
}
export interface CnpgPoolerInterface extends KubeObjectInterface {
  spec: CnpgPoolerSpec;
  status: CnpgPoolerStatus;
}
export class CnpgPooler extends KubeObject {
  static readonly apiVersion = 'postgresql.cnpg.io/v1';
  static readonly isNamespaced = true;
  static readonly kind = 'Pooler';
  static readonly apiName = 'poolers';
}

// Database
export interface CnpgDatabaseSpec {
  cluster: { name: string };
  name?: string;
  owner?: string;
}
export interface CnpgDatabaseStatus {
  ready?: boolean;
  applied?: boolean;
}
export interface CnpgDatabaseInterface extends KubeObjectInterface {
  spec: CnpgDatabaseSpec;
  status: CnpgDatabaseStatus;
}
export class CnpgDatabase extends KubeObject {
  static readonly apiVersion = 'postgresql.cnpg.io/v1';
  static readonly isNamespaced = true;
  static readonly kind = 'Database';
  static readonly apiName = 'databases';
}

// Publication
export interface CnpgPublicationSpec {
  cluster: { name: string };
  name?: string;
  dbname?: string;
}
export interface CnpgPublicationStatus {
  ready?: boolean;
  applied?: boolean;
}
export interface CnpgPublicationInterface extends KubeObjectInterface {
  spec: CnpgPublicationSpec;
  status: CnpgPublicationStatus;
}
export class CnpgPublication extends KubeObject {
  static readonly apiVersion = 'postgresql.cnpg.io/v1';
  static readonly isNamespaced = true;
  static readonly kind = 'Publication';
  static readonly apiName = 'publications';
}

// Subscription
export interface CnpgSubscriptionSpec {
  cluster: { name: string };
  name?: string;
  dbname?: string;
  publicationName?: string;
}
export interface CnpgSubscriptionStatus {
  ready?: boolean;
  applied?: boolean;
}
export interface CnpgSubscriptionInterface extends KubeObjectInterface {
  spec: CnpgSubscriptionSpec;
  status: CnpgSubscriptionStatus;
}
export class CnpgSubscription extends KubeObject {
  static readonly apiVersion = 'postgresql.cnpg.io/v1';
  static readonly isNamespaced = true;
  static readonly kind = 'Subscription';
  static readonly apiName = 'subscriptions';
}

// ImageCatalog (namespaced)
export interface CnpgImageCatalogSpec {
  images?: { major: number; image: string }[];
}
export interface CnpgImageCatalogInterface extends KubeObjectInterface {
  spec: CnpgImageCatalogSpec;
}
export class CnpgImageCatalog extends KubeObject {
  static readonly apiVersion = 'postgresql.cnpg.io/v1';
  static readonly isNamespaced = true;
  static readonly kind = 'ImageCatalog';
  static readonly apiName = 'imagecatalogs';
}

// ClusterImageCatalog (cluster-scoped)
export interface CnpgClusterImageCatalogInterface extends KubeObjectInterface {
  spec: CnpgImageCatalogSpec;
}
export class CnpgClusterImageCatalog extends KubeObject {
  static readonly apiVersion = 'postgresql.cnpg.io/v1';
  static readonly isNamespaced = false;
  static readonly kind = 'ClusterImageCatalog';
  static readonly apiName = 'clusterimagecatalogs';
}

// FailoverQuorum
export interface CnpgFailoverQuorumSpec {
  cluster: { name: string };
}
export interface CnpgFailoverQuorumStatus {
  ready?: boolean;
}
export interface CnpgFailoverQuorumInterface extends KubeObjectInterface {
  spec: CnpgFailoverQuorumSpec;
  status: CnpgFailoverQuorumStatus;
}
export class CnpgFailoverQuorum extends KubeObject {
  static readonly apiVersion = 'postgresql.cnpg.io/v1';
  static readonly isNamespaced = true;
  static readonly kind = 'FailoverQuorum';
  static readonly apiName = 'failoverquorums';
}
