import { z } from 'zod';
export declare const GetMeetingsRequestSchema: z.ZodObject<{
    filters: z.ZodOptional<z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<["scheduled", "live", "ended", "cancelled"]>>;
        startDateFrom: z.ZodOptional<z.ZodString>;
        startDateTo: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        search?: string | undefined;
        startDateFrom?: string | undefined;
        startDateTo?: string | undefined;
    }, {
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        search?: string | undefined;
        startDateFrom?: string | undefined;
        startDateTo?: string | undefined;
    }>>;
    pagination: z.ZodOptional<z.ZodObject<{
        limit: z.ZodDefault<z.ZodNumber>;
        offset: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        offset: number;
        limit: number;
    }, {
        offset?: number | undefined;
        limit?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    filters?: {
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        search?: string | undefined;
        startDateFrom?: string | undefined;
        startDateTo?: string | undefined;
    } | undefined;
    pagination?: {
        offset: number;
        limit: number;
    } | undefined;
}, {
    filters?: {
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        search?: string | undefined;
        startDateFrom?: string | undefined;
        startDateTo?: string | undefined;
    } | undefined;
    pagination?: {
        offset?: number | undefined;
        limit?: number | undefined;
    } | undefined;
}>;
export declare const GetMeetingsResponseSchema: z.ZodObject<{
    meetings: z.ZodArray<z.ZodObject<{
        meetingID: z.ZodString;
        taskID: z.ZodString;
        organizerUserID: z.ZodString;
        title: z.ZodString;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        startDateTime: z.ZodString;
        endDateTime: z.ZodString;
        meetingLink: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        meetingPlatform: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        isRecurring: z.ZodDefault<z.ZodBoolean>;
        recurrencePattern: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodDefault<z.ZodEnum<["scheduled", "live", "ended", "cancelled"]>>;
        isDeleted: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        status: "cancelled" | "scheduled" | "live" | "ended";
        taskID: string;
        title: string;
        isRecurring: boolean;
        startDateTime: string;
        endDateTime: string;
        meetingID: string;
        organizerUserID: string;
        description?: string | null | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    }, {
        createdAt: string;
        updatedAt: string;
        taskID: string;
        title: string;
        startDateTime: string;
        endDateTime: string;
        meetingID: string;
        organizerUserID: string;
        isDeleted?: boolean | undefined;
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        description?: string | null | undefined;
        isRecurring?: boolean | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    }>, "many">;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    meetings: {
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        status: "cancelled" | "scheduled" | "live" | "ended";
        taskID: string;
        title: string;
        isRecurring: boolean;
        startDateTime: string;
        endDateTime: string;
        meetingID: string;
        organizerUserID: string;
        description?: string | null | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    }[];
    total: number;
}, {
    meetings: {
        createdAt: string;
        updatedAt: string;
        taskID: string;
        title: string;
        startDateTime: string;
        endDateTime: string;
        meetingID: string;
        organizerUserID: string;
        isDeleted?: boolean | undefined;
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        description?: string | null | undefined;
        isRecurring?: boolean | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    }[];
    total: number;
}>;
export declare const CreateMeetingRequestSchema: z.ZodObject<Omit<{
    meetingID: z.ZodString;
    taskID: z.ZodString;
    organizerUserID: z.ZodString;
    title: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    startDateTime: z.ZodString;
    endDateTime: z.ZodString;
    meetingLink: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    meetingPlatform: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isRecurring: z.ZodDefault<z.ZodBoolean>;
    recurrencePattern: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<["scheduled", "live", "ended", "cancelled"]>>;
    isDeleted: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "isDeleted" | "createdAt" | "updatedAt" | "meetingID" | "organizerUserID">, "strip", z.ZodTypeAny, {
    status: "cancelled" | "scheduled" | "live" | "ended";
    taskID: string;
    title: string;
    isRecurring: boolean;
    startDateTime: string;
    endDateTime: string;
    description?: string | null | undefined;
    meetingLink?: string | null | undefined;
    meetingPlatform?: string | null | undefined;
    recurrencePattern?: string | null | undefined;
}, {
    taskID: string;
    title: string;
    startDateTime: string;
    endDateTime: string;
    status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
    description?: string | null | undefined;
    isRecurring?: boolean | undefined;
    meetingLink?: string | null | undefined;
    meetingPlatform?: string | null | undefined;
    recurrencePattern?: string | null | undefined;
}>;
export declare const UpdateMeetingRequestSchema: z.ZodObject<{
    meetingID: z.ZodString;
    updates: z.ZodObject<{
        status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["scheduled", "live", "ended", "cancelled"]>>>;
        taskID: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        isRecurring: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        startDateTime: z.ZodOptional<z.ZodString>;
        endDateTime: z.ZodOptional<z.ZodString>;
        meetingLink: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        meetingPlatform: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        recurrencePattern: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    }, "strip", z.ZodTypeAny, {
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        taskID?: string | undefined;
        title?: string | undefined;
        description?: string | null | undefined;
        isRecurring?: boolean | undefined;
        startDateTime?: string | undefined;
        endDateTime?: string | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    }, {
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        taskID?: string | undefined;
        title?: string | undefined;
        description?: string | null | undefined;
        isRecurring?: boolean | undefined;
        startDateTime?: string | undefined;
        endDateTime?: string | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    meetingID: string;
    updates: {
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        taskID?: string | undefined;
        title?: string | undefined;
        description?: string | null | undefined;
        isRecurring?: boolean | undefined;
        startDateTime?: string | undefined;
        endDateTime?: string | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    };
}, {
    meetingID: string;
    updates: {
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        taskID?: string | undefined;
        title?: string | undefined;
        description?: string | null | undefined;
        isRecurring?: boolean | undefined;
        startDateTime?: string | undefined;
        endDateTime?: string | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    };
}>;
export declare const DeleteMeetingRequestSchema: z.ZodObject<{
    meetingID: z.ZodString;
}, "strip", z.ZodTypeAny, {
    meetingID: string;
}, {
    meetingID: string;
}>;
export declare const JoinMeetingRequestSchema: z.ZodObject<{
    meetingID: z.ZodString;
}, "strip", z.ZodTypeAny, {
    meetingID: string;
}, {
    meetingID: string;
}>;
export declare const MeetingConflictResponseSchema: z.ZodObject<{
    status: z.ZodLiteral<"conflict">;
    serverEntity: z.ZodObject<{
        meetingID: z.ZodString;
        taskID: z.ZodString;
        organizerUserID: z.ZodString;
        title: z.ZodString;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        startDateTime: z.ZodString;
        endDateTime: z.ZodString;
        meetingLink: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        meetingPlatform: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        isRecurring: z.ZodDefault<z.ZodBoolean>;
        recurrencePattern: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodDefault<z.ZodEnum<["scheduled", "live", "ended", "cancelled"]>>;
        isDeleted: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        status: "cancelled" | "scheduled" | "live" | "ended";
        taskID: string;
        title: string;
        isRecurring: boolean;
        startDateTime: string;
        endDateTime: string;
        meetingID: string;
        organizerUserID: string;
        description?: string | null | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    }, {
        createdAt: string;
        updatedAt: string;
        taskID: string;
        title: string;
        startDateTime: string;
        endDateTime: string;
        meetingID: string;
        organizerUserID: string;
        isDeleted?: boolean | undefined;
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        description?: string | null | undefined;
        isRecurring?: boolean | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    }>;
    clientEntity: z.ZodObject<{
        meetingID: z.ZodString;
        taskID: z.ZodString;
        organizerUserID: z.ZodString;
        title: z.ZodString;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        startDateTime: z.ZodString;
        endDateTime: z.ZodString;
        meetingLink: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        meetingPlatform: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        isRecurring: z.ZodDefault<z.ZodBoolean>;
        recurrencePattern: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodDefault<z.ZodEnum<["scheduled", "live", "ended", "cancelled"]>>;
        isDeleted: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        status: "cancelled" | "scheduled" | "live" | "ended";
        taskID: string;
        title: string;
        isRecurring: boolean;
        startDateTime: string;
        endDateTime: string;
        meetingID: string;
        organizerUserID: string;
        description?: string | null | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    }, {
        createdAt: string;
        updatedAt: string;
        taskID: string;
        title: string;
        startDateTime: string;
        endDateTime: string;
        meetingID: string;
        organizerUserID: string;
        isDeleted?: boolean | undefined;
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        description?: string | null | undefined;
        isRecurring?: boolean | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    status: "conflict";
    serverEntity: {
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        status: "cancelled" | "scheduled" | "live" | "ended";
        taskID: string;
        title: string;
        isRecurring: boolean;
        startDateTime: string;
        endDateTime: string;
        meetingID: string;
        organizerUserID: string;
        description?: string | null | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    };
    clientEntity: {
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        status: "cancelled" | "scheduled" | "live" | "ended";
        taskID: string;
        title: string;
        isRecurring: boolean;
        startDateTime: string;
        endDateTime: string;
        meetingID: string;
        organizerUserID: string;
        description?: string | null | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    };
}, {
    status: "conflict";
    serverEntity: {
        createdAt: string;
        updatedAt: string;
        taskID: string;
        title: string;
        startDateTime: string;
        endDateTime: string;
        meetingID: string;
        organizerUserID: string;
        isDeleted?: boolean | undefined;
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        description?: string | null | undefined;
        isRecurring?: boolean | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    };
    clientEntity: {
        createdAt: string;
        updatedAt: string;
        taskID: string;
        title: string;
        startDateTime: string;
        endDateTime: string;
        meetingID: string;
        organizerUserID: string;
        isDeleted?: boolean | undefined;
        status?: "cancelled" | "scheduled" | "live" | "ended" | undefined;
        description?: string | null | undefined;
        isRecurring?: boolean | undefined;
        meetingLink?: string | null | undefined;
        meetingPlatform?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
    };
}>;
export type GetMeetingsRequest = z.infer<typeof GetMeetingsRequestSchema>;
export type GetMeetingsResponse = z.infer<typeof GetMeetingsResponseSchema>;
export type CreateMeetingRequest = z.infer<typeof CreateMeetingRequestSchema>;
export type UpdateMeetingRequest = z.infer<typeof UpdateMeetingRequestSchema>;
export type DeleteMeetingRequest = z.infer<typeof DeleteMeetingRequestSchema>;
export type JoinMeetingRequest = z.infer<typeof JoinMeetingRequestSchema>;
export type MeetingConflictResponse = z.infer<typeof MeetingConflictResponseSchema>;
//# sourceMappingURL=meetings.contract.d.ts.map