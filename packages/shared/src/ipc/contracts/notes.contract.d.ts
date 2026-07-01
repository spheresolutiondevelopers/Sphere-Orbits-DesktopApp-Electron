import { z } from 'zod';
export declare const GetNotesRequestSchema: z.ZodObject<{
    filters: z.ZodOptional<z.ZodObject<{
        entityType: z.ZodOptional<z.ZodEnum<["task", "event", "appointment", "meeting"]>>;
        entityID: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        search?: string | undefined;
        entityType?: "meeting" | "event" | "task" | "appointment" | undefined;
        entityID?: string | undefined;
    }, {
        search?: string | undefined;
        entityType?: "meeting" | "event" | "task" | "appointment" | undefined;
        entityID?: string | undefined;
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
        search?: string | undefined;
        entityType?: "meeting" | "event" | "task" | "appointment" | undefined;
        entityID?: string | undefined;
    } | undefined;
    pagination?: {
        offset: number;
        limit: number;
    } | undefined;
}, {
    filters?: {
        search?: string | undefined;
        entityType?: "meeting" | "event" | "task" | "appointment" | undefined;
        entityID?: string | undefined;
    } | undefined;
    pagination?: {
        offset?: number | undefined;
        limit?: number | undefined;
    } | undefined;
}>;
export declare const GetNotesResponseSchema: z.ZodObject<{
    notes: z.ZodArray<z.ZodObject<{
        noteID: z.ZodString;
        userID: z.ZodString;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        content: z.ZodString;
        taskID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        eventID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        appointmentID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        meetingID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        isDeleted: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userID: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        noteID: string;
        content: string;
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
    }, {
        userID: string;
        createdAt: string;
        updatedAt: string;
        noteID: string;
        content: string;
        isDeleted?: boolean | undefined;
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
    }>, "many">;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    notes: {
        userID: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        noteID: string;
        content: string;
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
    }[];
    total: number;
}, {
    notes: {
        userID: string;
        createdAt: string;
        updatedAt: string;
        noteID: string;
        content: string;
        isDeleted?: boolean | undefined;
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
    }[];
    total: number;
}>;
export declare const CreateNoteRequestSchema: z.ZodObject<Omit<{
    noteID: z.ZodString;
    userID: z.ZodString;
    title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    content: z.ZodString;
    taskID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    eventID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    appointmentID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    meetingID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isDeleted: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "userID" | "isDeleted" | "createdAt" | "updatedAt" | "noteID">, "strip", z.ZodTypeAny, {
    content: string;
    taskID?: string | null | undefined;
    title?: string | null | undefined;
    appointmentID?: string | null | undefined;
    eventID?: string | null | undefined;
    meetingID?: string | null | undefined;
}, {
    content: string;
    taskID?: string | null | undefined;
    title?: string | null | undefined;
    appointmentID?: string | null | undefined;
    eventID?: string | null | undefined;
    meetingID?: string | null | undefined;
}>;
export declare const UpdateNoteRequestSchema: z.ZodObject<{
    noteID: z.ZodString;
    updates: z.ZodObject<{
        taskID: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        appointmentID: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        eventID: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        meetingID: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        content: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
        content?: string | undefined;
    }, {
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
        content?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    noteID: string;
    updates: {
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
        content?: string | undefined;
    };
}, {
    noteID: string;
    updates: {
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
        content?: string | undefined;
    };
}>;
export declare const DeleteNoteRequestSchema: z.ZodObject<{
    noteID: z.ZodString;
}, "strip", z.ZodTypeAny, {
    noteID: string;
}, {
    noteID: string;
}>;
export declare const NoteConflictResponseSchema: z.ZodObject<{
    status: z.ZodLiteral<"conflict">;
    serverEntity: z.ZodObject<{
        noteID: z.ZodString;
        userID: z.ZodString;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        content: z.ZodString;
        taskID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        eventID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        appointmentID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        meetingID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        isDeleted: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userID: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        noteID: string;
        content: string;
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
    }, {
        userID: string;
        createdAt: string;
        updatedAt: string;
        noteID: string;
        content: string;
        isDeleted?: boolean | undefined;
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
    }>;
    clientEntity: z.ZodObject<{
        noteID: z.ZodString;
        userID: z.ZodString;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        content: z.ZodString;
        taskID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        eventID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        appointmentID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        meetingID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        isDeleted: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userID: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        noteID: string;
        content: string;
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
    }, {
        userID: string;
        createdAt: string;
        updatedAt: string;
        noteID: string;
        content: string;
        isDeleted?: boolean | undefined;
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    status: "conflict";
    serverEntity: {
        userID: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        noteID: string;
        content: string;
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
    };
    clientEntity: {
        userID: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        noteID: string;
        content: string;
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
    };
}, {
    status: "conflict";
    serverEntity: {
        userID: string;
        createdAt: string;
        updatedAt: string;
        noteID: string;
        content: string;
        isDeleted?: boolean | undefined;
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
    };
    clientEntity: {
        userID: string;
        createdAt: string;
        updatedAt: string;
        noteID: string;
        content: string;
        isDeleted?: boolean | undefined;
        taskID?: string | null | undefined;
        title?: string | null | undefined;
        appointmentID?: string | null | undefined;
        eventID?: string | null | undefined;
        meetingID?: string | null | undefined;
    };
}>;
export type GetNotesRequest = z.infer<typeof GetNotesRequestSchema>;
export type GetNotesResponse = z.infer<typeof GetNotesResponseSchema>;
export type CreateNoteRequest = z.infer<typeof CreateNoteRequestSchema>;
export type UpdateNoteRequest = z.infer<typeof UpdateNoteRequestSchema>;
export type DeleteNoteRequest = z.infer<typeof DeleteNoteRequestSchema>;
export type NoteConflictResponse = z.infer<typeof NoteConflictResponseSchema>;
//# sourceMappingURL=notes.contract.d.ts.map