import { User } from 'src/models/User/models';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import DataLoader from 'dataloader';

@Service()
export class UserDataLoader extends DataLoader<string, User | undefined> {
  constructor(userService: Repository<User>) {
    super(async (ids: readonly string[]) => {
      const users = await userService.findByIds(ids as string[]);
      return ids.map((id) => users.find((user) => user.id === id));
    });
  }
}
