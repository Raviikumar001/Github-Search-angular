Production Live URL: https://github-search-angular-nine.vercel.app

To run the project locally

git clone the repo

```
git clone https://github.com/Raviikumar001/Github-search-angular.git
```

```
cd Github-search-angular
```

Install dependecies

```
npm install
```

run the web app
Be sure to have angular client installed

```
ng serve
```

To run the Test
inside the project run

```
ng test --code-coverage
```

It will produce the test coverage report.

**All GET API's are cached**

Assumptions

1. While displaying the user's repository, if the username is invalid in url, then web app will route back to root page (search page)
2. If user enters invalid page number from the url, more than the total pages for pagnination, No repos message is shown, if page number is less than 0 then page 1 will always be shown.
3. Per page value for the number of repos shown will alawys be 10, 25, 50 100 per page,
4. In case when user has no topics in a repo then No Topics message is shown.
5. When user selects a page size then the repos are fetched with an initial page 1.



## Installation

1. Fork this repository to your github account.
2. Clone the forked repository and proceed with steps mentioned below.

### Install requirements

- Install angular cli [Ref](https://angular.io/cli)
- `npm install` in this repository

## Development server

Run `ng serve` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Further help

Visit the [Angular Documentation](https://angular.io/guide/styleguide) to learn more.
Styling is to be strictly done with [Tailwind](https://tailwindcss.com/docs/installation).
