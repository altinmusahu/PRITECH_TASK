# PRITECH Task Manager

A mobile task management app built with React Native and Expo.

---

## Tech Stack

- **React Native** + **Expo** (SDK 54)
- **React Navigation** — native stack navigator
- **AsyncStorage** — local persistence (JSON, no backend required)
- **react-native-gesture-handler** — swipe-to-delete on task items
- **JSONPlaceholder API** — external API used to fetch task title suggestions
- **uuid** — unique ID generation for tasks

---

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — install globally with `npm install -g expo-cli`
- For physical device: **Expo Go** app ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- For emulator: Android Studio (Android) or Xcode (iOS, macOS only)

### Install & Run

```bash
# 1. Clone the repository
git clone <repo-url>
cd PRITECH_TASK

# 2. Install dependencies
npm install

# 3. Start the dev server
npm start

# Then press:
#   a  — open on Android emulator
#   i  — open on iOS simulator (macOS only)
#   w  — open in web browser
# Or scan the QR code with Expo Go on your physical device
```

---

## What Was Implemented

### Core Features

**Task List Screen**
- Displays all tasks in a scrollable list with title, description preview, date, and status badge
- Header shows a live count of active vs. completed tasks
- Pull-to-refresh to reload tasks from storage
- Auto-refreshes when navigating back from Add or Detail screens

**Add Task Screen**
- Form with title (required, min 3 chars) and optional description
- Character counters (80 for title, 400 for description)
- Validation with inline error messages
- Keyboard UX: pressing Done on the description field dismisses the keyboard; tapping anywhere outside also dismisses it; the Add Task button scrolls into view above the keyboard
- Task suggestions pulled from the JSONPlaceholder public API — tap a suggestion to fill the title field instantly; includes a Refresh button to load a new batch

**Task Detail Screen**
- Shows full task info: title, description, creation date/time, and status
- Inline edit mode for title and description with the same validation rules
- Toggle status between "Not Completed" and "Completed"
- Delete task with a confirmation dialog (navigates back on confirm)

**Task Filtering & Search**
- Filter bar with tabs: All / Not Completed / Completed (with live counts)
- Search bar filters by title or description in real time

**Swipe to Delete**
- Swipe a task card left to reveal a Delete button directly from the list

### Data Layer

- All tasks are stored locally using **AsyncStorage** (no server, no login required)
- `useTasks` hook centralises all CRUD operations: create, read, update, toggle status, delete
- Tasks are persisted as a JSON array under the key `@pritech_tasks`
- Each task has: `id`, `title`, `description`, `status`, `createdAt`
