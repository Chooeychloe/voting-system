# IoT Project Voting

A student project voting app built with React and Vite. Google Apps Script provides the API and Google Sheets stores the student roster, projects, voting settings, and submitted votes.

## Requirements

- Node.js and npm
- A Google spreadsheet for the app's data
- A Google Apps Script web app connected to that spreadsheet

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local address to open in a browser. To create a production build, run:

```sh
npm run build
```

## Google Sheets setup

Create these four tabs with the exact names below. The first row is treated as the header row; data starts on row 2.

### `Students`

| A: student_number |
| --- |
| 202600001 |

Each student number must be unique. The script reads student numbers from column A.

### `Projects`

| A: id | B: title | C: group | D: image | E: members |
| --- | --- | --- | --- | --- |
| project-1 | Smart Home Automation | Group 1 | `https://...` | `Ana Reyes` (one name per line) |

Project IDs must be unique. The image column may be blank. Put each group member's name on a new line within the E cell; the names appear on the ballot, public results, and admin dashboard. For Google Drive images, share them so the app's voters can view them.

### `Votes`

| A: student_number | B: project_id | C: submitted_at |
| --- | --- | --- |

Leave this tab with only its header row when starting a new election. The script appends one row per accepted vote.

### `Settings`

| A: key | B: value |
| --- | --- |
| voting_open | FALSE |

Set `voting_open` to `TRUE` to accept votes and `FALSE` to close voting. The admin dashboard can change this value.

## Configure Apps Script

1. Open **Extensions > Apps Script** from the spreadsheet.
2. Replace the editor contents with [`VotingAppsScript.gs`](./VotingAppsScript.gs) and save.
3. In **Project Settings > Script Properties**, add `ADMIN_PASSWORD` with a strong, unique password. The admin login and voting status controls require this property.
4. Select **Deploy > New deployment**, choose **Web app**, set **Execute as** to your account, and set access to **Anyone** so students can reach the API. Deploy and authorize the requested spreadsheet access.
5. Copy the web app URL ending in `/exec`.

The current API URL is configured in [`src/services/votingService.js`](./src/services/votingService.js). Replace `API_URL` with your web app URL if it differs. After later Apps Script changes, edit the existing deployment and deploy a new version. If you create a separate deployment, update `API_URL` again.

## App routes

- `/` - student number verification and voting
- `/results` - public voting results
- `/admin` - administrator login and dashboard

Students verify with a number in the `Students` sheet, select a project, and confirm once. The Apps Script validates eligibility, voting status, project ID, and duplicate votes before recording a vote.

## Security notes

- The results endpoint is public and returns vote totals, registered-student count, and turnout.
- Student number verification checks whether a number is on the roster; it does not independently confirm who is entering it. Treat roster numbers as sensitive and share them only with eligible voters.
- Admin actions are checked by Apps Script using the `ADMIN_PASSWORD` script property. Do not put this password in frontend source code.

