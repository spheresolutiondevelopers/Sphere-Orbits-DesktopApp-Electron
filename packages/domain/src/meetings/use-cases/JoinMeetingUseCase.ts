import { err, type Result } from '@sphere/shared';
import { IMeetingRepository } from '../repositories/IMeetingRepository';

export interface JoinMeetingInput {
  meetingID: string;
  userID: string;
  participantEmail: string;
  participantName: string;
}

export class JoinMeetingUseCase {
  constructor(private readonly meetingRepo: IMeetingRepository) {}

  async execute(input: JoinMeetingInput): Promise<Result<{ meetingLink: string }, Error>> {
    if (!input.meetingID) {
      return err(new Error('meetingID is required'));
    }
    if (!input.userID) {
      return err(new Error('userID is required'));
    }
    if (!input.participantEmail) {
      return err(new Error('participantEmail is required'));
    }
    if (!input.participantName) {
      return err(new Error('participantName is required'));
    }

    // First, ensure the meeting exists and the user is authorized.
    const meetingResult = await this.meetingRepo.getMeetingById(input.meetingID, input.userID);
    if (meetingResult.isFailure()) {
      return meetingResult as any;
    }

    // Then, join the meeting (may call external API).
    return this.meetingRepo.joinMeeting(
      input.meetingID,
      input.userID,
      input.participantEmail,
      input.participantName
    );
  }
}