# Myngapp

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, Smart Monorepos · Fast CI.](https://nx.dev)** ✨

## Start the app

To start the development server run `nx serve myngapp`. Open your browser and navigate to http://localhost:4200/. Happy coding!

Github-search

A GitHub user search application built using Angular, TypeScript, and Tailwind CSS, designed to search and display GitHub users based on search queries. It uses Nx for enhanced workspace management and efficient development.

Features

- Search GitHub users by username.
- View basic user information, including profile picture and bio.
- Built with Angular (v16), TypeScript, and styled with Tailwind CSS.-
- Nx monorepo setup for efficient development and testing.
- Unit tests with code coverage reports.
- Optimized for performance and maintainability.

```
├── src/
│   ├── app/
│   └── assets/
├── .editorconfig
├── .gitignore
├── nx.json
├── package-lock.json
├── package.json
├── project.json
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json

```

Prerequisites
Ensure you have the following installed:

Node.js (v14.x or higher)
Angular CLI (v16.x)
Nx (latest version)

Installation

Clone this repository:

```
git clone <repository-url>

```

Navigate to the project directory:

```
cd github-search
```

Install the dependencies:

```
npm install
```

Running the Application
To run the application locally in development mode:

```
nx serve github-search
```

Visit http://localhost:4200 to view the application.

Building the Application
To build the application for production:

```
nx build github-search --configuration=production
```

The build output will be stored in the dist/ directory.

Running Tests
To run unit tests for the project with code coverage:

```
nx test github-search --code-coverage
```

The test results and coverage report will be generated in the coverage/ directory.

**All GET API's are cached**

Assumptions

1. While displaying the user's repository, if the username is invalid in url, then web app will route back to root page (search page)
2. If user enters invalid page number from the url, more than the total pages for pagnination, No repos message is shown, if page number is less than 0 then page 1 will always be shown.
3. Per page value for the number of repos shown will alawys be 10, 25, 50 100 per page,
4. In case when user has no topics in a repo then No Topics message is shown.
5. When user selects a page size then the repos are fetched with an initial page 1.
