# Compatibility Policy

This page explains what Product Engineer Pro knows about framework versions, how that
knowledge is verified, and what the skill does when your project uses something newer.
It also states which Node.js versions the CLI supports.

## How the skill decides which version you use

The skill never assumes the newest version. In a target repository it reads, in order:

1. The lockfile (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`).
2. Installed package metadata in `node_modules`.
3. The version range in `package.json`.
4. The verified snapshot (below), only when the repository gives no signal.

Guidance is applied for the version your repository actually uses. For example, a Next.js 14
project does not get Next.js 15+ asynchronous request APIs.

## The verified snapshot

[`skill/references/version-snapshot.json`](skill/references/version-snapshot.json) is the single
source of truth for the versions the skill has verified. Every entry records:

| Field | Meaning |
| --- | --- |
| `value` | The version that was verified |
| `meaning` | What kind of version it is (see below) |
| `source` | The official URL it was verified against |
| `checkedAt` | The date it was actually checked |
| `status` | `verified`, `stale`, or `unverified` |
| `preview`, `notes` | Optional: prereleases and compatibility notes, for information only |

The top-level `verifiedAt` is the **oldest** `checkedAt`, so the snapshot is only as fresh as its
least recently checked entry.

### Version meanings

| Meaning | Definition |
| --- | --- |
| `latest-stable` | Highest non-prerelease version from the official source on `checkedAt` |
| `active-lts` | Release line in Active LTS on `checkedAt`, per the official schedule |
| `maintenance-lts` | Release line in Maintenance LTS on `checkedAt` |
| `current` | Newest release line on `checkedAt`, whether or not it is LTS yet |
| `preview` | Beta, release candidate, or prerelease; never used as stable guidance |
| `last-tested` | Version the skill was last exercised against, not necessarily the newest |

An entry has exactly one meaning. "Latest stable" is not the same as "tested": the skill's
guidance is written for the versions in the snapshot, and newer releases are handled by the rule
below.

## When your project is newer than the snapshot

If a detected **major** version is newer than the snapshot, the skill:

1. Consults official documentation for that version when the host allows web access.
2. Otherwise says explicitly that its confidence is reduced, and why.
3. Never presents guidance for an older major as verified for the newer one.

Minor and patch releases newer than the snapshot are treated as compatible unless official
release notes say otherwise.

Product Engineer Pro does **not** promise support for every future version of every framework.

## How freshness is checked

| Check | When | What it does | Blocks a release when |
| --- | --- | --- | --- |
| `npm run check-freshness` | Locally and before each release | Offline: compares each entry's `checkedAt` with today | Any entry is older than `maxAgeDays` (90), or the snapshot is invalid |
| Weekly freshness workflow | Mondays, in GitHub Actions | Live: snapshot age **plus** official sources (npm registry, Node.js release index, PostgreSQL, MongoDB, OWASP) | A new major or standards edition appears, an entry is stale, or a source cannot be verified |

Entries older than half the limit produce a warning. If an official page changes layout and a
version cannot be read, the result is **unverified**, never a pass. Refresh steps are in
[CONTRIBUTING.md](CONTRIBUTING.md#refreshing-the-version-snapshot).

Skill invocations never make network calls just to look up versions.

## Node.js support for the CLI

| Policy | Versions |
| --- | --- |
| Minimum accepted (`engines`) | Node.js 18, kept for **legacy compatibility only** |
| Tested in CI | 18, 22, 24, 26 |
| Recommended | An active or maintenance LTS line: 26, 24, or 22 |

Node.js 18 and 20 are end of life upstream. The CLI still runs on 18 so existing users are not
stranded in the 2.x line, but running an end-of-life runtime is not recommended. Raising the
minimum is a breaking change and will only happen in a major release, announced in the
changelog.

The `website/` app has its own requirements and is built on Node.js 24 in CI.
