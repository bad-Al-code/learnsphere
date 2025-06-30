class HealthStageManager {
  private state: Record<string, boolean> = {
    db: false,
    rabbitmq: false,
    redis: false,
  };
  private criticalDependencies: string[] = ["db", "rabbitmq", "redis"];

  public set(
    dependency: "db" | "rabbitmq" | "redis",
    isHealthy: boolean
  ): void {
    this.state[dependency] = isHealthy;
  }

  public isReady(): boolean {
    return this.criticalDependencies.every((dep) => this.state[dep] === true);
  }
}

export const healthState = new HealthStageManager();
