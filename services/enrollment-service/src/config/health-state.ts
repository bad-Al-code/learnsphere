type Dependency = 'db' | 'rabbitmq' | 'redis';
type DependencyStatus = { status: 'UP' | 'DOWN'; details?: string };

class HealthStageManager {
  private state: Record<Dependency, DependencyStatus> = {
    db: { status: 'UP' },
    rabbitmq: { status: 'DOWN' },
    redis: { status: 'DOWN' },
  };

  private criticalDependencies: Dependency[] = ['db', 'rabbitmq', 'redis'];

  /**
   * Sets the health status of a critical dependency.
   * @param dependency The name of the dependency.
   * @param isHealthy Whether the dependency is connected and healthy.
   * @param details An optional error message if the dependency is unhealthy.
   */
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

  /**
   * Checks if all critical dependencies are healthy.
   * @returns True if all dependencies are 'UP', otherwise false.
   */
  public isReady(): boolean {
    return this.criticalDependencies.every(
      (dep) => this.state[dep].status === 'UP'
    );
  }

  /**
   * Generates a full health report.
   * @returns An object containing the overall status and the status for each dependency.
   */
  public getReport() {
    const isReady = this.isReady();

    return {
      status: isReady ? 'UP' : 'DOWN',
      dependencies: this.state,
    };
  }
}

export const healthState = new HealthStageManager();
