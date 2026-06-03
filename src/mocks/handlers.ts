import { http, HttpResponse } from 'msw';

// FriendDev: Fake response to emulate the database.
export const handlers = [
  http.get('/api/check-status', () => {
    return HttpResponse.json({
      submitted: true
    });
  }),

  http.post('/api/login', () => {
    return HttpResponse.json({});
  })
];
