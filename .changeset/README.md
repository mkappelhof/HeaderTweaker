# Changesets

This directory contains configuration and metadata for the Changesets versioning tool.

- `config.json`: Main configuration for Changesets.
- Individual markdown files: Each represents a changeset describing a change to be released.

## Usage

- Run `yarn changeset` to create a new changeset after making changes.
- Merging a PR to `master` will trigger the GitHub Actions workflow to create a release PR with updated version and changelog.
