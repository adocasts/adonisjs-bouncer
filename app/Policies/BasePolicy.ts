import { BasePolicy as BouncerBasePolicy } from "@ioc:Adonis/Addons/Bouncer";
import User from "App/Models/User";
import Role from "Contracts/enums/Role";

export default class BasePolicy extends BouncerBasePolicy {
  public async before(user: User | null) {
    if (user?.roleId === Role.ADMIN) {
      return true
    }
  }
}
