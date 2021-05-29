
export const ThreadState = {
    /**
     * Run the thread again this tick if CPU allows
     */
    RESUME: true,
    /**
     * Don't run the thread again until the next tick
     */
    SUSPEND: false
}
