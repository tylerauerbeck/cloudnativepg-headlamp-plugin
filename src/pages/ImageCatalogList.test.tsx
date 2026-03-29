import { describe, expect, it, vi } from 'vitest';

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

function getPgVersions(images: { major: number; image: string }[] | undefined): string {
  if (!images || images.length === 0) return 'None';
  return images
    .map(i => i.major)
    .sort((a, b) => b - a)
    .join(', ');
}

describe('ImageCatalog PG Versions', () => {
  it('returns None when images is undefined', () => {
    expect(getPgVersions(undefined)).toBe('None');
  });

  it('returns None when images is empty', () => {
    expect(getPgVersions([])).toBe('None');
  });

  it('returns single version', () => {
    expect(getPgVersions([{ major: 17, image: 'ghcr.io/cloudnative-pg/postgresql:17' }])).toBe(
      '17'
    );
  });

  it('returns versions sorted descending', () => {
    expect(
      getPgVersions([
        { major: 15, image: 'ghcr.io/cloudnative-pg/postgresql:15' },
        { major: 17, image: 'ghcr.io/cloudnative-pg/postgresql:17' },
        { major: 16, image: 'ghcr.io/cloudnative-pg/postgresql:16' },
      ])
    ).toBe('17, 16, 15');
  });

  it('handles duplicate major versions', () => {
    expect(
      getPgVersions([
        { major: 17, image: 'ghcr.io/cloudnative-pg/postgresql:17.1' },
        { major: 17, image: 'ghcr.io/cloudnative-pg/postgresql:17.2' },
      ])
    ).toBe('17, 17');
  });
});
