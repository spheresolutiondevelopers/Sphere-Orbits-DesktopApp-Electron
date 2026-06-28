import axios, { AxiosInstance } from 'axios';

export class ZoomApi {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor(apiBaseURL: string) {
    this.client = axios.create({
      baseURL: 'https://api.zoom.us/v2',
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  setAuthToken(token: string): void {
    this.accessToken = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Creates a Zoom meeting.
   */
  async createMeeting(
    topic: string,
    startTime: string,
    durationMinutes: number,
    timezone: string = 'UTC'
  ): Promise<{ meetingID: string; joinUrl: string; startUrl: string }> {
    if (!this.accessToken) {
      throw new Error('Zoom API requires an access token');
    }

    const response = await this.client.post('/users/me/meetings', {
      topic,
      type: 2, // Scheduled meeting
      start_time: startTime,
      duration: durationMinutes,
      timezone,
      settings: {
        join_before_host: true,
        mute_upon_entry: true,
        waiting_room: false,
      },
    });

    return {
      meetingID: response.data.id,
      joinUrl: response.data.join_url,
      startUrl: response.data.start_url,
    };
  }

  /**
   * Generates a join link for an existing Zoom meeting.
   */
  async generateJoinLink(
    meetingLink: string,
    participantEmail: string,
    participantName: string
  ): Promise<string> {
    // For Zoom, the join link is already provided in the meeting object.
    // However, if we need to generate a personalized link, we could add query params.
    // For simplicity, we just return the existing link.
    return meetingLink;
  }

  /**
   * Updates a Zoom meeting.
   */
  async updateMeeting(meetingID: string, updates: { topic?: string; startTime?: string; duration?: number }): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Zoom API requires an access token');
    }

    const payload: any = {};
    if (updates.topic) payload.topic = updates.topic;
    if (updates.startTime) payload.start_time = updates.startTime;
    if (updates.duration) payload.duration = updates.duration;

    await this.client.patch(`/meetings/${meetingID}`, payload);
  }

  /**
   * Deletes a Zoom meeting.
   */
  async deleteMeeting(meetingID: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Zoom API requires an access token');
    }
    await this.client.delete(`/meetings/${meetingID}`);
  }

  /**
   * Gets meeting details from Zoom.
   */
  async getMeeting(meetingID: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Zoom API requires an access token');
    }
    const response = await this.client.get(`/meetings/${meetingID}`);
    return response.data;
  }
}