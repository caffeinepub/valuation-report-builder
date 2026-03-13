import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Report {
    id: bigint;
    status: string;
    content: string;
    clientName: string;
    createdAt: bigint;
    reportDate: string;
    reportType: string;
    reportNumber: string;
}
export interface backendInterface {
    createReport(reportType: string, clientName: string): Promise<bigint>;
    deleteReport(id: bigint): Promise<boolean>;
    getReport(id: bigint): Promise<Report | null>;
    listReports(): Promise<Array<Report>>;
    updateReport(id: bigint, clientName: string, reportDate: string, status: string, content: string): Promise<boolean>;
}
