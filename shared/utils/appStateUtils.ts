import { AppState, type AppStateResponse } from '../schemas/appStateSchema';

export function isAcceptingResponses(state: AppState): boolean {
  // TODO @FriendDev
  //return false;
  return state === AppState.Open || state === AppState.Scheduled;
}

export function matchingClosed(state: AppState): boolean {
  return state === AppState.Closed || state === AppState.Paused;
}

function parseDateString(dateString: string | null): Date | null {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function getWindowStartDate(stateResponse: AppStateResponse | null): Date | null {
  if (!stateResponse) {
    return null;
  }

  if (isAcceptingResponses(stateResponse.currentState)) {
    return parseDateString(stateResponse.roundStart);
  }

  return null;
}

export function getWindowEndDate(stateResponse: AppStateResponse | null): Date | null {
  if (!stateResponse) {
    return null;
  }

  if (isAcceptingResponses(stateResponse.currentState)) {
    return parseDateString(stateResponse.roundEnd);
  }

  return null;
}