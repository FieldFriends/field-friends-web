/**
 * The encrypted PII of a user's survey response.
 */
export class EncryptedSurveyData {
  encryptedName: string;
  encryptedEmail: string;
  encryptedInterests: string;
  encryptedActivities: string;
  encryptedIntroduction: string;
  encryptedBlocked: string[];
  sessionKey: string;

  constructor(
    encryptedName: string,
    encryptedEmail: string,
    encryptedInterests: string,
    encryptedActivities: string,
    encryptedIntroduction: string,
    encryptedBlocked: string[],
    sessionKey: string
  ) {
    this.encryptedName = encryptedName;
    this.encryptedEmail = encryptedEmail;
    this.encryptedInterests = encryptedInterests;
    this.encryptedActivities = encryptedActivities;
    this.encryptedIntroduction = encryptedIntroduction;
    this.encryptedBlocked = encryptedBlocked;
    this.sessionKey = sessionKey;
  }
}
