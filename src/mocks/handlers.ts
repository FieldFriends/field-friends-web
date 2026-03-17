import { http, HttpResponse } from 'msw';

// FriendDev: Fake response to emulate the database.
export const handlers = [
  http.get('/api/get-account-data', () => {
    return HttpResponse.json({
      gender: 'Male',
      age: 21,
      affiliation: 'Upperclassman',
      social_energy: 'Medium',
      submitted_at: new Date().toISOString()
    });
  }),

  http.get('/api/check-status', () => {
    return HttpResponse.json({
      submitted: true
    });
  })
];
