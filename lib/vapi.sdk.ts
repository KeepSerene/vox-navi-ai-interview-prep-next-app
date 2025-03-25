import Vapi from "@vapi-ai/web";

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_API_KEY!);

// Workflow:
/**
 * A user calls Vapi
 * Vapi asks the user a series of predefined questions
 * Vapi then ends the call & sends the collected information to our API endpoint
 * The API endpoint then passes the info to Gemini
 * Gemini generates a series of questions for the user and passes them back to our API endpoint
 * We finally store the interview details in Firestore, displaying them later in our app
 *
 * User -> Vapi -> API endpoint <-> Gemini
 * API endpoint -> Firestore -> Our app
 */
