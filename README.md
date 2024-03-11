[![Actions Status](https://github.com/opifexM/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/opifexM/frontend-project-11/actions)
[![Node CI](https://github.com/opifexM/RSS-Aggregator/actions/workflows/nodejs.yml/badge.svg)](https://github.com/opifexM/RSS-Aggregator/actions/workflows/nodejs.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/f3a279d5843e622b2b62/maintainability)](https://codeclimate.com/github/opifexM/RSS-Aggregator/maintainability)

WebSite: https://rss-aggregator-jade.vercel.app/

# RSS Aggregator

RSS Aggregator is an interactive web application designed to collect, parse, and display news feeds from various sources in real-time. Built with JavaScript, utilizing libraries and frameworks such as axios for HTTP requests, i18next for internationalization, Yup for validation, and onChange for state management, this application offers a user-friendly interface for reading and managing RSS feeds.

## Description

The RSS Aggregator facilitates the addition of RSS feed URLs by users, validates these URLs, and then fetches the feed data using axios. It parses the XML data, converts it into a structured format, and displays the feed and articles to the user. The application is localized with i18next, supporting multiple languages to cater to a global audience. It employs Yup for input validation, ensuring that only valid and unique RSS feed URLs are processed. The state management is handled by onChange, providing a reactive interface that updates the UI in real time as the application state changes.

## Features

-   **URL Validation and RSS Fetching**: Validates user input and fetches RSS feeds using axios.
-   **Internationalization**: Supports multiple languages through i18next, enhancing accessibility for non-English speakers.
-   **State Management**: Utilizes onChange for reactive state management, ensuring the UI is always in sync with the application state.
-   **Article Reading State**: Tracks which articles have been read, improving user experience by distinguishing between new and read articles.
-   **Dynamic UI Updates**: Adds new feeds and updates articles in real-time without page reloads.
-   **Customizable View**: Allows users to view article summaries within the application and offers the option to read full articles in a new browser tab.

## Usage

The application is accessible via a web browser. Users can add new RSS feed URLs through the input field, view a list of feeds, and read articles directly within the app or in a new tab. The interface provides feedback on the success or failure of feed addition, including validation messages for incorrect inputs.

## Technologies Used

-   **JavaScript**: Core programming language for application logic.
-   **axios**: Used for making HTTP requests to fetch RSS feed data.
-   **i18next**: Provides internationalization support, allowing for multi-language UI.
-   **Yup**: Handles validation of input fields, ensuring the RSS feed URLs are valid and unique.
-   **onChange**: Manages application state, enabling reactive UI updates.
-   **Bootstrap**: Used for styling and modal dialog implementation.

On the development side, the project leverages:

-   **ESLint**: Ensures code quality and consistency.
-   **Node.js**: Provides the runtime environment for executing JavaScript on the server side.

## License

RSS Aggregator is licensed under the MIT license.
