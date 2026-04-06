import { SNSEvent, SNSMessage } from "aws-lambda";
import { hashEmail } from "#api/_utils/crypto";
import { supabaseAdmin } from "./supabase-admin";

/*
For handling bounce emails. Compile with:
npx esbuild api/_utils/bounceHandler.ts --bundle --platform=node --target=node18 --outfile=dist/bounceHandler.js
*/

const LOG_HASH_LENGTH = 8;
const BANNED_USERS_TABLE = "banned_users";
const EMAIL_HASH_COLUMN = "email_hash";

enum SnsNotificationType {
  Bounce = "Bounce",
  Complaint = "Complaint"
}

export const handler = async (event: SNSEvent): Promise<void> => {
  console.log(`Processing ${event.Records.length} records...`);

  for (const record of event.Records) {
    try {
      const snsMessage: SNSMessage = record.Sns;
      const messageBody = JSON.parse(snsMessage.Message);
      const notificationType = messageBody.notificationType;

      let badEmails: string[] = [];

      if (notificationType === SnsNotificationType.Bounce) {
        const recipients = messageBody.bounce.bouncedRecipients;

        badEmails = recipients.map((r: any) => {
          return r.emailAddress;
        });
      } else if (notificationType === SnsNotificationType.Complaint) {
        const recipients = messageBody.complaint.complainedRecipients;

        badEmails = recipients.map((r: any) => {
          return r.emailAddress;
        });
      } else {
        console.log(`Ignored notification type: ${notificationType}`);
        continue;
      }

      for (const email of badEmails) {
        const emailHash = hashEmail(email);
        const displayHash = emailHash.substring(0, LOG_HASH_LENGTH);

        console.log(`Flagging ${notificationType} for hash: ${displayHash}...`);

        const { error } = await supabaseAdmin.from(BANNED_USERS_TABLE).upsert(
          {
            [EMAIL_HASH_COLUMN]: emailHash,
            reason: `AWS SES ${notificationType}`
          },
          { onConflict: EMAIL_HASH_COLUMN }
        );

        if (error) {
          console.error("Supabase Upsert Error:", error);
        }
      }
    } catch (error) {
      console.error("Error processing record:", error);
      throw error;
    }
  }
};