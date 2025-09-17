type Dependency = 'db' | 'rabbitmq';
type DependencyStatus = { status: 'UP' | 'DOWN'; details?: string };

class HealthStateManager {
  private states: Record<Dependency, DependencyStatus> = {
    db: { status: 'DOWN' },
    rabbitmq: { status: 'DOWN' },
  };

  private criticalDependencies: Dependency[] = ['db', 'rabbitmq'];

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
    this.states[dependency] = {
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
      (dep) => this.states[dep].status === 'UP'
    );
  }

  /**
   * Generates a full health report.
   * @returns An object containing the overall status and the status of each dependency.
   */
  public getReport() {
    const isReady = this.isReady();
    return {
      status: isReady ? 'UP' : 'DOWN',
      dependencies: this.states,
    };
  }
}

export const healthState = new HealthStateManager();
