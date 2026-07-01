import { z } from 'zod';
export declare const GetEventsRequestSchema: z.ZodObject<{
    filters: z.ZodOptional<z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<["planned", "ongoing", "completed", "cancelled"]>>;
        categoryID: z.ZodOptional<z.ZodString>;
        startDateFrom: z.ZodOptional<z.ZodString>;
        startDateTo: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        categoryID?: string | undefined;
        search?: string | undefined;
        startDateFrom?: string | undefined;
        startDateTo?: string | undefined;
    }, {
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        categoryID?: string | undefined;
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
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        categoryID?: string | undefined;
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
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        categoryID?: string | undefined;
        search?: string | undefined;
        startDateFrom?: string | undefined;
        startDateTo?: string | undefined;
    } | undefined;
    pagination?: {
        offset?: number | undefined;
        limit?: number | undefined;
    } | undefined;
}>;
export declare const GetEventsResponseSchema: z.ZodObject<{
    events: z.ZodArray<z.ZodObject<{
        eventID: z.ZodString;
        userID: z.ZodString;
        categoryID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        taskID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        name: z.ZodString;
        format: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        planningNotes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        startDateTime: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        endDateTime: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodDefault<z.ZodEnum<["planned", "ongoing", "completed", "cancelled"]>>;
        isRecurring: z.ZodDefault<z.ZodBoolean>;
        recurrencePattern: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        isDeleted: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userID: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        status: "completed" | "cancelled" | "planned" | "ongoing";
        isRecurring: boolean;
        eventID: string;
        name: string;
        taskID?: string | null | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    }, {
        userID: string;
        createdAt: string;
        updatedAt: string;
        eventID: string;
        name: string;
        isDeleted?: boolean | undefined;
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        taskID?: string | null | undefined;
        isRecurring?: boolean | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    }>, "many">;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total: number;
    events: {
        userID: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        status: "completed" | "cancelled" | "planned" | "ongoing";
        isRecurring: boolean;
        eventID: string;
        name: string;
        taskID?: string | null | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    }[];
}, {
    total: number;
    events: {
        userID: string;
        createdAt: string;
        updatedAt: string;
        eventID: string;
        name: string;
        isDeleted?: boolean | undefined;
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        taskID?: string | null | undefined;
        isRecurring?: boolean | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    }[];
}>;
export declare const CreateEventRequestSchema: z.ZodObject<Omit<{
    eventID: z.ZodString;
    userID: z.ZodString;
    categoryID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    taskID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    name: z.ZodString;
    format: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    planningNotes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    startDateTime: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    endDateTime: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<["planned", "ongoing", "completed", "cancelled"]>>;
    isRecurring: z.ZodDefault<z.ZodBoolean>;
    recurrencePattern: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isDeleted: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "userID" | "isDeleted" | "createdAt" | "updatedAt" | "eventID">, "strip", z.ZodTypeAny, {
    status: "completed" | "cancelled" | "planned" | "ongoing";
    isRecurring: boolean;
    name: string;
    taskID?: string | null | undefined;
    categoryID?: string | null | undefined;
    startDateTime?: string | null | undefined;
    endDateTime?: string | null | undefined;
    recurrencePattern?: string | null | undefined;
    format?: string | null | undefined;
    planningNotes?: string | null | undefined;
}, {
    name: string;
    status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
    taskID?: string | null | undefined;
    isRecurring?: boolean | undefined;
    categoryID?: string | null | undefined;
    startDateTime?: string | null | undefined;
    endDateTime?: string | null | undefined;
    recurrencePattern?: string | null | undefined;
    format?: string | null | undefined;
    planningNotes?: string | null | undefined;
}>;
export declare const UpdateEventRequestSchema: z.ZodObject<{
    eventID: z.ZodString;
    updates: z.ZodObject<{
        status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["planned", "ongoing", "completed", "cancelled"]>>>;
        taskID: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        isRecurring: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        categoryID: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        startDateTime: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        endDateTime: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        recurrencePattern: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        name: z.ZodOptional<z.ZodString>;
        format: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
        planningNotes: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    }, "strip", z.ZodTypeAny, {
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        taskID?: string | null | undefined;
        isRecurring?: boolean | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        name?: string | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    }, {
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        taskID?: string | null | undefined;
        isRecurring?: boolean | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        name?: string | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    eventID: string;
    updates: {
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        taskID?: string | null | undefined;
        isRecurring?: boolean | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        name?: string | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    };
}, {
    eventID: string;
    updates: {
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        taskID?: string | null | undefined;
        isRecurring?: boolean | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        name?: string | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    };
}>;
export declare const DeleteEventRequestSchema: z.ZodObject<{
    eventID: z.ZodString;
}, "strip", z.ZodTypeAny, {
    eventID: string;
}, {
    eventID: string;
}>;
export declare const EventConflictResponseSchema: z.ZodObject<{
    status: z.ZodLiteral<"conflict">;
    serverEntity: z.ZodObject<{
        eventID: z.ZodString;
        userID: z.ZodString;
        categoryID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        taskID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        name: z.ZodString;
        format: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        planningNotes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        startDateTime: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        endDateTime: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodDefault<z.ZodEnum<["planned", "ongoing", "completed", "cancelled"]>>;
        isRecurring: z.ZodDefault<z.ZodBoolean>;
        recurrencePattern: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        isDeleted: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userID: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        status: "completed" | "cancelled" | "planned" | "ongoing";
        isRecurring: boolean;
        eventID: string;
        name: string;
        taskID?: string | null | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    }, {
        userID: string;
        createdAt: string;
        updatedAt: string;
        eventID: string;
        name: string;
        isDeleted?: boolean | undefined;
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        taskID?: string | null | undefined;
        isRecurring?: boolean | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    }>;
    clientEntity: z.ZodObject<{
        eventID: z.ZodString;
        userID: z.ZodString;
        categoryID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        taskID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        name: z.ZodString;
        format: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        planningNotes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        startDateTime: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        endDateTime: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodDefault<z.ZodEnum<["planned", "ongoing", "completed", "cancelled"]>>;
        isRecurring: z.ZodDefault<z.ZodBoolean>;
        recurrencePattern: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        isDeleted: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userID: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        status: "completed" | "cancelled" | "planned" | "ongoing";
        isRecurring: boolean;
        eventID: string;
        name: string;
        taskID?: string | null | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    }, {
        userID: string;
        createdAt: string;
        updatedAt: string;
        eventID: string;
        name: string;
        isDeleted?: boolean | undefined;
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        taskID?: string | null | undefined;
        isRecurring?: boolean | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    status: "conflict";
    serverEntity: {
        userID: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        status: "completed" | "cancelled" | "planned" | "ongoing";
        isRecurring: boolean;
        eventID: string;
        name: string;
        taskID?: string | null | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    };
    clientEntity: {
        userID: string;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        status: "completed" | "cancelled" | "planned" | "ongoing";
        isRecurring: boolean;
        eventID: string;
        name: string;
        taskID?: string | null | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    };
}, {
    status: "conflict";
    serverEntity: {
        userID: string;
        createdAt: string;
        updatedAt: string;
        eventID: string;
        name: string;
        isDeleted?: boolean | undefined;
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        taskID?: string | null | undefined;
        isRecurring?: boolean | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    };
    clientEntity: {
        userID: string;
        createdAt: string;
        updatedAt: string;
        eventID: string;
        name: string;
        isDeleted?: boolean | undefined;
        status?: "completed" | "cancelled" | "planned" | "ongoing" | undefined;
        taskID?: string | null | undefined;
        isRecurring?: boolean | undefined;
        categoryID?: string | null | undefined;
        startDateTime?: string | null | undefined;
        endDateTime?: string | null | undefined;
        recurrencePattern?: string | null | undefined;
        format?: string | null | undefined;
        planningNotes?: string | null | undefined;
    };
}>;
export type GetEventsRequest = z.infer<typeof GetEventsRequestSchema>;
export type GetEventsResponse = z.infer<typeof GetEventsResponseSchema>;
export type CreateEventRequest = z.infer<typeof CreateEventRequestSchema>;
export type UpdateEventRequest = z.infer<typeof UpdateEventRequestSchema>;
export type DeleteEventRequest = z.infer<typeof DeleteEventRequestSchema>;
export type EventConflictResponse = z.infer<typeof EventConflictResponseSchema>;
//# sourceMappingURL=events.contract.d.ts.map