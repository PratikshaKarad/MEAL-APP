# MEAL-APP

## Description
The Meal App is a web application that allows users to search for meals by name, ingredient, or category and save their favorite meals for quick access later. The app uses TheMealDB API to search for and discover new meals and recipes. This project is built with vanilla JavaScript, HTML, and CSS to provide a seamless user experience.

## Key Features
1. **Search Meal by Name:**
   - Allows users to search for meals by their name.
2. **Auto Suggestion:**
   - Provides real-time search suggestions as users type keywords.
3. **Save Favorite Meals:**
   - Users can save meals to a list of favorites for future reference.
4. **Persistent Storage:**
   - Favorite meals are saved using `localStorage`, allowing users to restore saved meals even after reopening the browser.
5. **Responsive Design:**
   - Works seamlessly on both mobile and desktop devices.

## Files

### `index.html`
The main HTML file containing the structure of the app. It includes:
- A search bar for finding meals.
- A section to display search results.
- Links to the Meal Detail Page and My Favorite Meals Page.

### `script.js`
The JavaScript file containing the functionality of the app. It includes:
- Functions to fetch data from TheMealDB API.
- Event listeners for dynamic search results.
- Logic to add or remove meals from the favorites list using `localStorage`.
- Code to navigate between different pages and display the appropriate content.

### `styles.css`
The CSS file for styling the app. It includes:
- Styles for the layout and design of the home page, meal detail page, and favorite meals page.
- Responsive design to ensure the app looks good on different screen sizes.
- Specific styles for buttons, search results, and meal details.


