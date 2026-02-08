# Test Plan: Basic Operations for Portfolio OS App

## Assumptions
- The app starts from a clean state.
- All routes and main UI elements are accessible.
- Tests are independent and can be run in any order.

---

## 1. App Boot and Desktop Load

**Steps:**
1. Navigate to the root URL.
2. Wait for the BIOS/boot screen (if present).
3. Wait for the desktop to appear.

**Expected:**
- Desktop UI is visible.
- No errors or loading spinners remain.

---

## 2. Navigation Bar and Route Switching

**Steps:**
1. From the desktop, locate the navigation bar/menu.
2. Click each main route: Home, About, Projects, Experience, Contact.
3. Wait for each page to load.

**Expected:**
- Each route loads the correct content.
- The URL updates accordingly.
- No visual glitches or errors.

---

## 3. Start Menu Operations

**Steps:**
1. Click the Start button.
2. Verify the Start menu opens.
3. Interact with at least one Start menu item (e.g., Shut Down).

**Expected:**
- Start menu opens and closes as expected.
- Menu items respond to clicks.

---

## 4. Window Management

**Steps:**
1. Open an app/window from the desktop or Start menu.
2. Minimize, maximize, and close the window.
3. Drag the window if draggable.

**Expected:**
- Window responds to all controls.
- Window can be moved, minimized, maximized, and closed.

---

## 5. Icon Interactions

**Steps:**
1. Click a desktop icon.
2. Verify the corresponding app/window opens.

**Expected:**
- The correct app/window opens.
- Icon click feedback is visible.

---

## 6. Contact Form (if present)

**Steps:**
1. Navigate to the Contact route.
2. Fill out and submit the contact form.

**Expected:**
- Form submits successfully.
- Success or error notification is shown.

---

## 7. Responsiveness

**Steps:**
1. Resize the browser window to mobile and tablet sizes.
2. Repeat navigation and window operations.

**Expected:**
- UI adapts to different screen sizes.
- No elements are cut off or unusable.

---

## 8. Error Handling

**Steps:**
1. Attempt to navigate to a non-existent route.

**Expected:**
- A 404 or error page is shown.
- The app does not crash.

---

## Automated Tests

### 1. App Boot and Desktop Load

- **Test:** should display BIOS screen on initial load
  - **Steps:**
    1. Navigate to the root URL.
    2. Wait for the BIOS screen to appear.
  - **Expected:**
    - BIOS screen is visible.
    - BIOS text content is present.

- **Test:** should transition from BIOS to Desktop
  - **Steps:**
    1. Navigate to the root URL.
    2. Wait for the BIOS screen.
    3. Wait for the desktop to load.
  - **Expected:**
    - BIOS screen is no longer visible after desktop loads.

- **Test:** should display desktop UI elements after boot
  - **Steps:**
    1. Navigate to the root URL.
    2. Wait for the desktop to load.
  - **Expected:**
    - Navbar, Start button, and desktop icons are visible.

- **Test:** should have no loading spinners or errors after boot
  - **Steps:**
    1. Navigate to the root URL.
    2. Wait for the desktop to fully load.
  - **Expected:**
    - No loading indicators or error screens are visible.

- **Test:** should take visual snapshot of BIOS screen
  - **Steps:**
    1. Navigate to the root URL.
    2. Wait for the BIOS screen.
    3. Take a screenshot.
  - **Expected:**
    - Screenshot of BIOS screen is saved.

- **Test:** should take visual snapshot of Desktop
  - **Steps:**
    1. Navigate to the root URL.
    2. Wait for the desktop to fully load.
    3. Take a screenshot.
  - **Expected:**
    - Screenshot of loaded desktop is saved.

---

**Success Criteria:**  
All steps complete without errors, and the UI behaves as expected for each operation. Automated tests pass successfully.
