import {
  Repo,
} from "@automerge/automerge-repo";
// import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";

// Determine WebSocket URL based on environment
// const getWebSocketUrl = () => {
//   if (import.meta.env.PROD) {
//     // Production - replace with your actual server URL
//     return 'wss://api.bardsballad.com/sync'
//   }
//   // Development
//   return 'ws://localhost:3000/sync'
// }

const repo = new Repo({
  network: [
    // new BroadcastChannelNetworkAdapter(), // Cross-tab sync
    // new BrowserWebSocketClientAdapter(getWebSocketUrl()), // Server sync
  ],
  // storage: new IndexedDBStorageAdapter('bardsballad-automerge'),
  // Enable to see sync activity in console
  // isEphemeral: false,
});

// Add the repo to the global window object so it can be accessed in the browser console
// This is useful for debugging and testing purposes.
declare global {
  interface Window {
    repo: Repo;
  }
}
window.repo = repo;

export { repo };