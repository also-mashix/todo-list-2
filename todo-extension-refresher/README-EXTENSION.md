# Todo Extension

This project has been converted into a Chrome extension that allows you to manage your to-do list directly from your browser.

## Features

- Create, edit, and delete todo items
- Mark todos as complete
- Filter todos by status (all, active, completed)
- Persistent storage using Chrome's storage API
- Theme selection

## Building the Extension

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build-extension
```

This will create a `build` folder containing the extension files.

## Installing the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" by toggling the switch in the top right corner
3. Click "Load unpacked" and select the `build` folder created in the previous step
4. The Todo Extension should now appear in your extensions list

## Using the Extension

- Click on the Todo Extension icon in your browser toolbar to open the todo list
- Add new tasks using the input field at the top
- Click on a task to mark it as complete
- Use the filter buttons to show all, active, or completed tasks
- Click the edit button to modify a task
- Click the delete button to remove a task

## Development

- Run `npm start` to start the development server
- The app will run in a browser window, using localStorage instead of Chrome's storage API
- Make your changes and then run `npm run build-extension` to build the extension

## Extension Structure

- `manifest.json`: Configuration file for the Chrome extension
- `background.js`: Background script that runs when the extension is installed
- `content.js`: Content script that runs in the context of web pages
- React components in the `src` folder handle the UI and logic

## Future Enhancements

- Add keyboard shortcuts for quick access
- Implement context menu integration to add selected text as a todo
- Add notifications for task reminders
- Sync todos across devices using Chrome sync
