import { BasicGenerator } from './index';

export default class Generator extends BasicGenerator {
  writing(): void {
    super.writeFiles({
      context: {
        name: this.name,
      },
    });
  }
}
