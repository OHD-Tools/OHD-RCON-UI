import { init } from '@paralleldrive/cuid2';
const ID_LENGTH = 26;
const createId = init({ length: ID_LENGTH });
export class IdUtil {
  public static readonly idLength = ID_LENGTH;
  public static generateId() {
    return createId();
  }
}
