// Type declarations for lunar-javascript library
// This library provides Chinese Lunar Calendar calculations including Saju (Four Pillars of Destiny)

declare module 'lunar-javascript' {
    export class Solar {
        static fromDate(date: Date): Solar;
        static fromYmd(year: number, month: number, day: number): Solar;
        static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;

        getYear(): number;
        getMonth(): number;
        getDay(): number;
        getHour(): number;
        getMinute(): number;
        getSecond(): number;
        getLunar(): Lunar;
    }

    export class Lunar {
        static fromYmd(year: number, month: number, day: number): Lunar;
        static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Lunar;

        getYear(): number;
        getMonth(): number;
        getDay(): number;
        getSolar(): Solar;
        getEightChar(): EightChar;
    }

    export class EightChar {
        // 천간 (Heavenly Stems)
        getYearGan(): string;  // 년간
        getMonthGan(): string; // 월간
        getDayGan(): string;   // 일간
        getTimeGan(): string;  // 시간

        // 지지 (Earthly Branches)
        getYearZhi(): string;  // 년지
        getMonthZhi(): string; // 월지
        getDayZhi(): string;   // 일지
        getTimeZhi(): string;  // 시지
    }
}
