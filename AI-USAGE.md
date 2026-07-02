# AI Usage Log

You are expected to use AI well and prove it. At least 3 substantial entries.
At least one must be a time AI was confidently wrong and you caught it.

## AI moment 1: TypeScript Types Structure

- What I was trying to do: Create the foundational types for User, Tool and Booking interfaces
- The prompt I wrote: "create typescript interfaces for a tool sharing app with user, tool and booking. make sure it has everything we need"
- What the AI gave back: It gave me interfaces with extra stuff like ratings, reviews, avatarUrl that wasnt in our decision log. Also it made joinedDate as a string instead of Date.
- What was wrong / weak / risky about it: The extra fields would make the mock data more complicated then needed. String dates is bad for date operations later. We told AI to cut features but it added them anyway lol
- What I changed and why: I removed the ratings and reviews fields and changed joinedDate to proper Date type. Also added comments to every field cuz beginner need to understand what each thing does

## AI moment 2: Mock Data Generation

- What I was trying to do: Generate fake tool data with realistic looking tools and owners
- The prompt I wrote: "make me 10 fake tools for testing with different categories like power tools and garden tools, give me some owners too"
- What the AI gave back: It gave me 10 tools but they all had prices and rental rates which we dont want because its a free only platform
- What was wrong / weak / risky about it: It didn't read our context that we got rid of paid/free filter. It was just making generic marketplace data. Also some of the owners had the same name which is confusing
- What I changed and why: I removed all the price fields and made sure each owner had different names and unique details. Also I only kept 2-3 tools as examples and left comment saying "add more mock tools as needed"

## AI moment 3: Welcome Screen Form Handling

- What I was trying to do: Create a login form that captures user info before they see anything
- The prompt I wrote: "write a react component for welcome screen that has form inputs for name email phone and address then submits to create user"
- What the AI gave back: It made a good component with useState hooks but it didnt validate the inputs. Also it tried to hit an API endpoint that doesnt exist yet
- What was wrong / weak / risky about it: We dont have backend yet so API calls will fail. No validation means bad data. The form had no accessibility labels for screen readers
- What I changed and why: I removed the API call and just created user object in state, added required attributes to inputs, added aria-label for accessibility. Also added preventDefault on form submit cuz thats important

## AI moment 4: Tool Card Component

- What I was trying to do: Make a reusable card component that shows one tool with image and details
- The prompt I wrote: "make me a react component that displays a tool card with image name category owner and distance and a button to click"
- What the AI gave back: It gave me a working card but the onClick handler was in the image tag only, not the whole card. Also it had too much inline styling
- What was wrong / weak / risky about it: User would only be able to click the image to see details, not the whole card which is bad UX. Inline styles are harder to maintain and cant use theme variables
- What I changed and why: I moved onClick to the div wrapper so the whole card is clickable. Removed inline styles and used classNames instead so we can style with CSS variables for dark mode

## AI moment 5: Home Screen with Tool List

- What I was trying to do: Build the main page that shows all tools in a grid
- The prompt I wrote: "create a home screen component that maps through tools array and shows each one as a tool card"
- What the AI gave back: It gave me the basic map logic but it didnt pass the tool object to the card, just the id. Also forgot to add a key prop which React warns about
- What was wrong / weak / risky about it: The card wouldnt have the data it needs to display. Missing keys in lists cause rendering bugs and React warnings
- What I changed and why: I passed the whole tool object to ToolCard and added key={tool.id} to the mapped element. Also added a message when no tools are available instead of showing nothing

## AI moment 6: Search Bar Component

- What I was trying to do: Create a search input that filters tools by keyword
- The prompt I wrote: "write a search component that takes a callback function and calls it when user types"
- What the AI gave back: Basic input component that calls onChange but didnt debounce the function
- What was wrong / weak / risky about it: Calling the filter function on every keystroke is wasteful, could cause performance issues with big lists
- What I changed and why: I added a comment about debouncing but kept it simple for beginners. Also noted that the filtering logic goes in parent component, not the search bar itself

## AI moment 7: Category Filter

- What I was trying to do: Add filter buttons so users can filter by tool category
- The prompt I wrote: "add category filter buttons to home screen that let users pick power tools garden tools etc"
- What the AI gave back: It made the buttons but used hardcoded category list instead of importing from mockTools
- What was wrong / weak / risky about it: If we add new categories later we gotta change it in two places which is bad. Hardcoded data is hard to maintain
- What I changed and why: I imported categories from mockTools data file so theres only one source of truth. Also added comment explaining why we do it this way

## AI moment 8: Distance Filter - WHERE AI WAS CONFIDENTLY WRONG

- What I was trying to do: Add a range slider so users can filter by distance
- The prompt I wrote: "add distance filter with a slider that goes from 0 to 100 km and filters tools"
- What the AI gave back: It confidently gave me code using a range input with max="100" and then did the filtering like `if (tool.distance > maxDistance)` with the greater than sign
- What was wrong / weak / risky about it: THE LOGIC WAS BACKWARDS. It was showing tools FURTHER than the limit instead of CLOSER. This is a major bug that would break the feature completely and users wouldnt understand why
- What I changed and why: I caught this by testing the logic in my head. Changed it to `tool.distance <= maxDistance` to show tools within the distance limit. Also added a comment explaining the logic so its clear

## AI moment 9: Tool Detail Screen

- What I was trying to do: Create a page that shows full tool details and owner contact info
- The prompt I wrote: "make a detail screen component that shows tool image description owner name email phone and address and a book now button"
- What the AI gave back: It gave the layout but didnt check if the tool was already borrowed before showing the button
- What was wrong / weak / risky about it: Users could try to book a tool thats already taken which breaks our flow
- What I changed and why: Added a check `{!tool.isBorrowed && <button>Book Now</button>}` and also show a message when tool is unavailable. This matches Decision 4 which shows contact details

## AI moment 10: Booking Form

- What I was trying to do: Create a form to capture borrower details when booking
- The prompt I wrote: "create booking form component that shows tool details borrower info and has a confirm button"
- What the AI gave back: It made the form but didnt validate that borrower filled in required fields before confirming
- What was wrong / weak / risky about it: Empty bookings could be created with no info which is bad
- What I changed and why: I added validation check and also added optional notes field so borrower can communicate with owner. Made it clear what info is already filled vs what they need to add

## AI moment 11: Booking Confirmation Screen

- What I was trying to do: Show success message after booking with next steps
- The prompt I wrote: "make confirmation screen that shows booking id tool name owner phone and tells user to contact owner"
- What the AI gave back: Just showed the data, no next steps or instructions
- What was wrong / weak / risky about it: User doesnt know what to do next, its confusing
- What I changed and why: Added a numbered list of next steps: contact owner, arrange pickup, enjoy tool. Also added message that tool was removed from listing. Made it feel more complete

## AI moment 12: My Posted Tools Page

- What I was trying to do: Create page showing tools the user posted
- The prompt I wrote: "make component that shows only the current users tools and lets them edit or delete them"
- What the AI gave back: It filtered tools correctly but the edit and delete buttons didnt have any functionality attached
- What was wrong / weak / risky about it: Buttons do nothing which is confusing for users
- What I changed and why: I added comments that edit and delete are placeholders for future. Also added message when user hasnt posted any tools yet with button to post first one

## AI moment 13: Dark Mode Implementation

- What I was trying to do: Add dark mode toggle that switches colors
- The prompt I wrote: "create a hook for dark mode that toggles theme and saves preference to localstorage"
- What the AI gave back: It made localStorage code but it was using localStorage.setItem with string instead of JSON.stringify for complex data
- What was wrong / weak / risky about it: When reading back it would fail to parse if we ever add more data to dark mode settings
- What I changed and why: I changed to use JSON.stringify and JSON.parse properly. Also added try-catch for when localStorage is full or corrupted

## AI moment 14: App Navigation Structure

- What I was trying to do: Create main App component that manages which screen to show
- The prompt I wrote: "make app component with state that tracks current screen and renders different components based on current screen"
- What the AI gave back: It made the screen switching but used magic strings like 'home' 'detail' everywhere without types
- What was wrong / weak / risky about it: No type safety, easy to make typos. Strings are error prone
- What I changed and why: Created a type `type Screen = 'welcome' | 'home' | 'detail' | 'booking' | 'confirmation' | 'myTools'` so TypeScript catches mistakes. Also made dark mode toggle appear in header

## AI moment 15: Responsive CSS and Styling

- What I was trying to do: Make app work on phones tablets and desktop
- The prompt I wrote: "give me css with media queries that makes the tools grid responsive on different screen sizes"
- What the AI gave back: It made media queries but used pixel values for breakpoints which is not flexible
- What was wrong / weak / risky about it: Hard to maintain, values are arbitrary. Mobile first approach is better
- What I changed and why: Changed to use `@media (min-width: 640px)` pattern and used CSS variables for colors so dark mode works. Also added gradient background for welcome screen

## AI moment 16: Keyboard Navigation and Accessibility

- What I was trying to do: Make sure app works with just keyboard no mouse
- The prompt I wrote: "add keyboard navigation to interactive elements so users can tab through and press enter"
- What the AI gave back: It added onKeyDown handlers but only checked for Enter key
- What was wrong / weak / risky about it: Buttons also respond to Space key which the code didnt handle
- What I changed and why: Added Space key handling too with `e.key === ' '`. Also added aria-label and role attributes for screen readers. Added comment explaining accessibility

## AI moment 17: TypeScript Type Safety

- What I was trying to do: Make sure we never use any and all data is properly typed
- The prompt I wrote: "create utility functions for tools that have full type annotations and return proper types"
- What the AI gave back: It made functions with types but used `any` in a validation function because it was "easier"
- What was wrong / west / risky about it: Using `any` defeats the purpose of TypeScript strict mode. BRIEF says no any allowed
- What I changed and why: I removed the any and wrote proper validation logic that returns boolean. Also added comment about never using any in this project

## AI moment 18: Error Boundaries

- What I was trying to do: Catch errors so app doesnt crash completely
- The prompt I wrote: "make error boundary component that catches errors and shows error message"
- What the AI gave back: It made the class component but didnt have componentDidCatch which is important
- What was wrong / weak / risky about it: Only getDerivedStateFromError isnt enough, some errors slip through
- What I changed and why: Added componentDidCatch to log errors to console for debugging. Also added reload button so user can recover

## AI moment 19: Client-Side Data Persistence

- What I was trying to do: Save user data to localStorage so it stays between page refreshes
- The prompt I wrote: "write functions to save and load user data from localstorage with proper error handling"
- What the AI gave back: It made the functions but didnt type the return value, just returned whatever JSON.parse gave back
- What was wrong / weak / risky about it: Could return wrong type of data, not type safe
- What I changed and why: Added `as User` type assertion after parsing so TypeScript knows what type we get. Also added try-catch around parse to handle corruption

## AI moment 20: Deployment and Testing Checklist

- What I was trying to do: Create checklist to make sure everything works before deploying
- The prompt I wrote: "give me a deployment checklist that verifies typescript compiles responsive design works and no errors"
- What the AI gave back: Generic checklist that was too long and didnt mention testing the live URL
- What was wrong / weak / risky about it: BRIEF says we gotta test the live deployed URL in fresh browser. Checklist forgot this critical step
- What I changed and why: Added specific testing instructions for each feature, testing on mobile, testing keyboard nav, and specifically testing live URL in fresh browser before submitting

## AI moment 21: Image Loading Debugging

- What I was trying to do: Fix the tool image display issue by switching the Power Drill URL to a local asset and troubleshooting why it still didn’t show.
- The prompt I wrote: "why is my powerdrill picture not showing" and later "find me appropriate images on the internet and link them to the image url"
- What the AI gave back: It suggested the wrong local path and later used unstable Unsplash source URLs that could return 503 errors.
- What was wrong / weak / risky about it: The AI kept assuming external image hosting was reliable and did not account for Netlify/Vite asset serving or temporary remote failures.
- What I changed and why: I corrected the path to `/images/powerdrill.jpg`, confirmed the file existed under `public/images`, and then moved to line-style placeholders so the app works without requiring live remote images.
