import { z } from 'zod';
export declare const NoteSchema: z.ZodObject<{
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
export type Note = z.infer<typeof NoteSchema>;
//# sourceMappingURL=notes.schema.d.ts.map