export const enum LogLevel {
    DEFAULT = -1,
    DEBUG = 0,
    INFO = 1,
    ALERT = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5
  }

  const styles = {
    [LogLevel.DEFAULT]: 'color: white; background-color: black',
    [LogLevel.DEBUG]: 'color: #008FAF',
    [LogLevel.INFO]: 'color: green',
    [LogLevel.ALERT]: 'color: #00BFAF',
    [LogLevel.WARN]: 'color: orange',
    [LogLevel.ERROR]: 'color: red',
    [LogLevel.FATAL]: 'color: yellow; background-color: red'
  }

  export class Logger {

    private prefix: string;
    private level: LogLevel;

    public constructor(prefix: string) {
        this.prefix = prefix ? prefix + ' ' : '';
        this.level = LogLevel.INFO;
    }

    public static withPrefix(prefix: string): Logger {
        return new Logger(prefix);
    }

    public log (level: LogLevel, message: string): void {
        const style = styles[level] || styles[LogLevel.DEFAULT];
        console.log(`<log severity="${level}" style="${style}">${this.prefix}${message}</log>`)
    }

    public debug (message: string): void {
        this.log(LogLevel.DEBUG, message)
    }

    public info (message: string): void {
        this.log(LogLevel.INFO, message)
    }

    public warn (message: string): void {
        this.log(LogLevel.WARN, message)
    }

    public alert (message: string): void {
        this.log(LogLevel.ALERT, message)
    }

    public error (message: string): void {
        this.log(LogLevel.ERROR, message)
    }

    public fatal (message: string): void {
        this.log(LogLevel.FATAL, message)
    }

  }
