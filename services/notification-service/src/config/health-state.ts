class HealthStateManager {
  private states: Record<string, boolean> = {
    db: false,
    rabbitmq: false,
    redis: false,
  };

  private criticalDependencies: string[] = ['rabbitmq'];

  public set(
    dependency: 'db' | 'rabbitmq' | 'redis',
    isHealthy: boolean
  ): void {
    this.states[dependency] = isHealthy;
  }

  public isReady(): boolean {
    return this.criticalDependencies.every((dep) => this.states[dep] === true);
  }
}

export const healthState = new HealthStateManager();
