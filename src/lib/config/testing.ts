// Testing Configuration
export const TESTING_CONFIG = {
  // Set this to true to enable fake authentication for testing
  ENABLE_FAKE_AUTH: true,
  
  // Fake user data for testing
  FAKE_USER: {
    id: 1,
    username: "TestUser",
    confirmed: 1,
    role: {
      id: 585,
      user_id: 1,
      role_id: "Manager",
      server: 0
    },
    character: [
      {
        id: 5442345,
        memberid: 1,
        firstname: "Johnny",
        lastname: "Parker"
      },
      {
        id: 24523534,
        memberid: 2,
        firstname: "Lester",
        lastname: "Dawson"
      },
      {
        id: 9355356,
        memberid: 3,
        firstname: "Angela",
        lastname: "Rosetti"
      },
      {
        id: 64364344,
        memberid: 4,
        firstname: "Justin",
        lastname: "Sanderson"
      },
      {
        id: 5436635,
        memberid: 5,
        firstname: "Spencer",
        lastname: "Simon"
      },
      {
        id: 1235162,
        memberid: 6,
        firstname: "Richard",
        lastname: "Watts"
      }
    ]
  }
};

// Helper function to check if fake auth is enabled
export function isFakeAuthEnabled(): boolean {
  return TESTING_CONFIG.ENABLE_FAKE_AUTH;
}

// Helper function to get fake user data
export function getFakeUser() {
  return TESTING_CONFIG.FAKE_USER;
}
