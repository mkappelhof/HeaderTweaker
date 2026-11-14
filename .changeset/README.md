# Changesets

This directory contains configuration and metadata for the Changesets versioning tool.
- `config.json`: Main configuration for Changesets.
- Individual markdown files: Each represents a changeset describing a change to be released.

## Usage

- Run `pnpm changeset` to create a new changeset after making changes.
- Merging a PR to `master` triggers the release workflow, which bumps the version, updates the changelog, commits that to `master` and creates a GitHub release.
- Dependabot PRs don't need a changeset: the release workflow adds one for every Dependabot commit that touches `apps/browser-extension/package.json`, unless the built extension is identical to the last release.
