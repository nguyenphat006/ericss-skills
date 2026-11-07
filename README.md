# ericss-skills

**English** | [Tiếng Việt](README.vi.md)

made by ericss

A collection of Claude Code skills, packaged as a plugin marketplace.

## Plugin `landing-kit`

Build a **CMS-backed landing page or company website for any industry**: manufacturing, services, SaaS, restaurants, hotels, real estate, education, healthcare, nonprofits, events...

| Skill | What it covers |
| --- | --- |
| `landing-cms-stack` | 6-round discovery that ends in a written brief; content models per industry; Next.js 16 (App Router, next-intl, shadcn/Tailwind 4) + Django 5.2 LTS / Wagtail 8; tag-based caching and an HMAC revalidate webhook; backend layering; security and CI; Docker Compose; code templates |
| `landing-design-system` | Role-based tokens and how to derive a palette from brand colors; shared components; a catalog of section layouts with the industries each suits; page presets per website type; i18n and copy rules; reference code |

The two skills are designed to work together:
- the technical skill handles the skeleton and the data;
- the design skill handles the UI.

Both always **ask first** about the business, goals, content structure, specs and brand colors, and only then start building.

## Install

Inside Claude Code:

```
/plugin marketplace add nguyenphat006/ericss-skills
/plugin install landing-kit@ericss-skills
```

Or from a terminal:

```
claude plugin marketplace add nguyenphat006/ericss-skills
claude plugin install landing-kit@ericss-skills
```

Once installed, the skills trigger on their own when you ask for a website. You can also call them directly: `/landing-kit:landing-cms-stack`, `/landing-kit:landing-design-system`.

Update to the latest version:

```
claude plugin marketplace update ericss-skills
claude plugin update landing-kit@ericss-skills
```

Without the plugin system, copy a folder `plugins/landing-kit/skills/<skill-name>` into:
- `~/.claude/skills/` to use it in every project;
- or a repo's `.claude/skills/` to use it in that repo only.

## Example prompts

- "Build a website for my dental clinic, with a CMS so we can post services and doctors ourselves"
- "Create a landing page for a timber export company, with a product catalog filtered by material, in 2 languages"
- "Add a Rooms page with filters to our hotel website; the main color is navy blue"

The skills answer in the language you write in.

## Repo structure

```
.claude-plugin/marketplace.json
plugins/landing-kit/
  .claude-plugin/plugin.json
  skills/
    landing-cms-stack/       SKILL.md, references/, assets/
    landing-design-system/   SKILL.md, references/, assets/
```
