export interface TimerValues {
    PODOMORO_MINUTES: number;
    SHORT_BREAK_MINUTES: number;
    LONG_BREAK_MINUTES: number;

    targetHour: number;
    targetMinute: number;
}

export interface TodoElement {
    desc: string;
    completed: boolean;
}

export interface Todo {
    list: TodoElement[];
}