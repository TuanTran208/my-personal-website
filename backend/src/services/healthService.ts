import si from 'systeminformation';

export interface SystemHealthData {
    cpu: {
        currentLoad: number;
        avgLoad: number;
    };
    memory: {
        total: number;
        used: number;
        active: number;
        available: number;
    };
    storage: Array<{
        fs: string;
        type: string;
        size: number;
        used: number;
        use: number;
        mount: string;
    }>;
}

export const getSystemHealth = async (): Promise<SystemHealthData> => {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const fs = await si.fsSize();

    return {
        cpu: {
            currentLoad: cpu.currentLoad,
            avgLoad: cpu.avgLoad,
        },
        memory: {
            total: mem.total,
            used: mem.used,
            active: mem.active,
            available: mem.available,
        },
        storage: fs.map(disk => ({
            fs: disk.fs,
            type: disk.type,
            size: disk.size,
            used: disk.used,
            use: disk.use,
            mount: disk.mount,
        })),
    };
};
