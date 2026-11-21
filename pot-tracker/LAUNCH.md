# Launch plan and audit: Pot Tracker

Every app gets a copy of this file in the root of its repo. It is both the
business plan and the checklist that shows how far along the app is.

**To audit (instructions for Claude):** go through every row below, check it
the way the "How to check" column says, and update the Status and Evidence
columns. Use only `Done`, `Not done`, `Partly` or `Unknown`. Write `Unknown`
when you could not check, and say why. Update "Last audited" at the bottom. An
audit is read-only: do not fix anything, deploy anything or change any other
file. Finish by listing the three most valuable things to do next.

## The plan

Fill these in before building much. Short answers are fine.

| Question | Answer |
|---|---|
| What is it, in one sentence? | A phone web app that shows potters in a shared studio whether their work has been fired and which shelf it is on. |
| Who is it for? | Shared ceramics studios: the kiln tech who unloads, and the potters looking for their work. |
| What problem does it solve for them? | Pots get lost, mixed up or forgotten as they move between kilns and shelves. |
| What do they use today instead? |  |
| How does it make money? | A monthly fee per studio. Free for potters. |
| What does it cost to run each month? |  |
| What number says it is working? (visits, sign-ups, sales) |  |
| When do we stop if it is not working? |  |

## 1. Repo

| Item | How to check | Status | Evidence |
|---|---|---|---|
| GitHub repo exists | The repo opens on GitHub |  |  |
| GitHub repo is private | Check the repo's visibility on GitHub |  |  |
| README says what the app is and how to run it | Read `README.md` |  |  |
| No passwords or keys in the repo | Search the code and history for secrets |  |  |
| This file is in the repo and filled in | Read `LAUNCH.md` |  |  |

## 2. App

| Item | How to check | Status | Evidence |
|---|---|---|---|
| Core feature works end to end | Use the live app for its main job |  |  |
| Works on a phone | Open it at phone width |  |  |
| Deploys from the main branch | See "Standard deploy" below |  |  |
| A staging copy exists for trying changes | Find a preview address for a branch (step 6 of "Standard deploy") |  |  |
| Errors are reported somewhere | Find error tracking or logs |  |  |

### Standard deploy

Every app deploys the same way: Cloudflare builds and deploys it whenever `main` changes on GitHub. Nobody runs a deploy command by hand. To set an app up this way:

1. **Config in the repo.** A `wrangler.jsonc` in the app folder with the Worker's `name` and every address the app answers on listed under `routes` as custom domains, `www` included.
2. **Two standard commands.** `npm run build` builds the app. `npx wrangler deploy` deploys it. If the app needs extra build steps, put them inside the `build` script so the two commands stay the same.
3. **Connect the repo.** In Cloudflare: Workers & Pages, open the Worker (or Create, then Import a repository), Settings, Build, and connect the GitHub repo.
4. **Same build settings everywhere.** Production branch `main`. Build command `npm run build`. Deploy command `npx wrangler deploy`. Root directory: the app folder if it is not the repo root.
5. **One shared build token.** When Cloudflare asks for an API token, pick the existing build token; do not create a new one per app.
6. **Preview builds on.** Turn on builds for other branches with the command `npx wrangler versions upload`. Each branch then gets its own preview address, which serves as staging.
7. **Secrets in Cloudflare, never in the repo.** Add them under the Worker's Settings, Variables and Secrets.
8. **Prove it.** Push a small change to `main` and watch it appear under Deployments, then on the live address.

The Cloudflare menu names above were written from memory, so treat the click paths as approximate.

| Item | How to check | Status | Evidence |
|---|---|---|---|
| The repo is connected to Cloudflare and a push to `main` deploys | Worker, Settings, Build shows the repo; or push and watch Deployments |  |  |
| Build command is `npm run build` and deploy command is `npx wrangler deploy` | Read the Worker's Build settings and `package.json` |  |  |
| Every address, `www` included, is listed in `wrangler.jsonc` | Read `routes` in `wrangler.jsonc` |  |  |
| It uses the shared build token | Worker, Settings, Build shows the token name |  |  |
| Other branches get a preview address | Push a branch and look for its preview link |  |  |
| Nobody deploys by hand | Search the README and scripts for manual deploy steps |  |  |

## 3. Domain

| Item | How to check | Status | Evidence |
|---|---|---|---|
| Domain is on Cloudflare and points at the app | Load the address |  |  |
| HTTPS works with a valid certificate | Load the `https://` address |  |  |
| One address only: `www` and old addresses redirect | Load each variant |  |  |
| A contact email address exists for the app | Ask the owner |  |  |

## 4. Found on Google and Bing

| Item | How to check | Status | Evidence |
|---|---|---|---|
| Verified in Google Search Console | Ask the owner, or look for the verification TXT record |  |  |
| Imported into Bing Webmaster Tools | Ask the owner |  |  |
| Every page has its own title and description | Read the HTML of each page |  |  |
| Page text is in the HTML without JavaScript | Fetch the raw HTML |  |  |
| `sitemap.xml` exists and is submitted | Fetch `/sitemap.xml` |  |  |
| `robots.txt` lets search engines in | Fetch the live `/robots.txt` |  |  |
| AI crawlers are allowed or blocked on purpose | Check the live `/robots.txt` and Cloudflare's AI bots setting |  |  |
| Link previews have a title, description and image | Read the `og:` tags |  |  |
| Structured data says what the site is | Look for JSON-LD |  |  |
| Canonical address tag on every page | Read the HTML |  |  |
| Loads fast on a phone | Run a speed test on the live site |  |  |

## 5. Money

| Item | How to check | Status | Evidence |
|---|---|---|---|
| The way it makes money is written in "The plan" | Read the plan above |  |  |
| A price is set | Read the plan or the site |  |  |
| Payments work, if it charges | Make a test payment |  |  |
| Monthly running cost is known | Read the plan above |  |  |

## 6. Marketing

| Item | How to check | Status | Evidence |
|---|---|---|---|
| Social accounts exist where the users are (Instagram, Facebook, LinkedIn, ...) | Ask the owner for the links |  |  |
| The site links to the accounts, and they link back | Read the site and the profiles |  |  |
| Share buttons or a shareable result, if it suits the app | Use the app |  |  |
| Listed on nickfix.dev "Recent work" | Read that page |  |  |
| A launch post is written and posted | Ask the owner |  |  |
| Listed where the audience looks (directories, forums, Product Hunt) | Ask the owner |  |  |
| Google Business Profile and Apple Maps listing, if it is a local business | Ask the owner |  |  |

## 7. Everything else

| Item | How to check | Status | Evidence |
|---|---|---|---|
| Visitor numbers are measured | Find analytics on the site |  |  |
| Privacy policy, and terms if it takes money or accounts | Find the pages |  |  |
| Users have a way to send feedback | Find a contact link or form |  |  |
| Five real people have tried it and said what they think | Ask the owner |  |  |
| User data is backed up, if it stores any | Find the backup setup |  |  |
| Someone is told when the site goes down | Find uptime monitoring |  |  |

## Audit log

| Date | Audited by | Summary |
|---|---|---|
|  |  |  |

**Last audited:** never
