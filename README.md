# Fyle Frontend Challenge

Production Live: https://fyle-internship-challenge-23-dun.vercel.app
To run the project locally

git clone the repo

https://github.com/Raviikumar001/fyle-internship-challenge-23.git

```
cd fyle-internship-challenge-23
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
2. If user enters invalid page  number from the url, more than the total pages for pagnination, No repos message is shown, if page number is less than 0 then page 1 will always be shown. 
3. Per page value for the number of repos shown will alawys be 10, 25, 50 100 per page,
4. In case when use has no topics in a repo then No Topics message is shown.




## Who is this for?

This challenge is meant for candidates who wish to intern at Fyle and work with our engineering team. The candidate should be able to commit to at least 6 months of dedicated time for internship.

## Why work at Fyle?

Fyle is a fast-growing Expense Management SaaS product. We are ~40 strong engineering team at the moment. 

We are an extremely transparent organization. Check out our [careers page](https://careers.fylehq.com) that will give you a glimpse of what it is like to work at Fyle. Also, check out our Glassdoor reviews [here](https://www.glassdoor.co.in/Reviews/Fyle-Reviews-E1723235.htm). You can read stories from our teammates [here](https://stories.fylehq.com).

## Challenge outline

This challenge involves implementing application using github api. 

The services that you need to use are already implemented - check out ApiService.

You can see details of this challenge [here](https://fyleuniverse.notion.site/fyleuniverse/Fyle-Frontend-development-challenge-cb5085e5e0864e769e7b98c694400aaa)

__Note__ - This challenge is in angular. We work on angular frameworks & after you join we expect the same from you. Hence it is required to complete this assignement in angular itself.

## What happens next?

You will hear back within 48 hours from us via email.

## Installation

1. Fork this repository to your github account.
2. Clone the forked repository and proceed with steps mentioned below.

### Install requirements
* Install angular cli [Ref](https://angular.io/cli)
* `npm install` in this repository 

## Development server

Run `ng serve` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Further help

Visit the [Angular Documentation](https://angular.io/guide/styleguide) to learn more.
Styling is to be strictly done with [Tailwind](https://tailwindcss.com/docs/installation).
