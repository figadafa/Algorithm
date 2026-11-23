# Figa Branch Update

This branch contains the following updates and features:

## Features Implemented:
*   **User Authentication & Management:**
    *   Implemented Supabase authentication for user registration and login (Codelab 3).
    *   Integrated `expo-secure-store` for secure token storage (Codelab 1).
    *   Refactored authentication logic to separate it from the UI, removed vault demo screen, and utilized secure storage within the Supabase adapter.
*   **Learning & Data Management:**
    *   Designed and implemented the `learning_tasks` schema with Row Level Security (RLS) and a data layer.
    *   Developed daily learning goal tracking and streak management using `AsyncStorage`.
    *   Enhanced material link handling with HTTPS validation and error alerts.
*   **User Interface & Experience:**
    *   Introduced page routing and implemented dark/light mode functionality.
    *   Created a landing page for the application.
    *   Improved layout handling by importing `SafeAreaView` from `react-native-safe-area-context`.
    *   Ensured learning progress is preserved across different navigation states.
*   **Supabase Integration:**
    *   Set up the Supabase client and integrated health checks (Codelab 2).
    *   Added message type to login and session checks to Supabase health.

## Project Structure & Refinements:
*   Refactored the overall file structure for better organization.
*   Updated documentation (README) to clarify API integration and enhance error handling details.
*   Adjusted `async-storage` version to 2.2.0 and ignored `.env` files.