type Dependency = 'db' | 'rabbitmq' | 'redis';
type DependencyStatus = { status: 'UP' | 'DOWN'; details?: string };

class HealthStageManager {
  private state: Record<Dependency, DependencyStatus> = {
    db: { status: 'DOWN' },
    rabbitmq: { status: 'DOWN' },
    redis: { status: 'DOWN' },
  };

  private criticalDependencies: Dependency[] = ['db', 'rabbitmq', 'redis'];

  public set(
    dependency: Dependency,
    isHealthy: boolean,
    details?: string
  ): void {
    this.state[dependency] = {
      status: isHealthy ? 'UP' : 'DOWN',
      details: isHealthy ? undefined : details,
    };
  }

  public isReady(): boolean {
    return this.criticalDependencies.every(
      (dep) => this.state[dep].status === 'UP'
    );
  }

  public getReport() {
    const isReady = this.isReady();

    return {
      status: isReady ? 'UP' : 'DOWN',
      dependencies: this.state,
    };
  }
}

export const healthState = new HealthStageManager();
