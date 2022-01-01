import Bouncer, {action} from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Post from 'App/Models/Post'
import Role from "Contracts/enums/Role";
import BasePolicy from "App/Policies/BasePolicy";

export default class PostPolicy extends BasePolicy {
  @action({ allowGuest: true })
	public async viewList(_: User | null) {
    return true
  }

  @action({ allowGuest: true })
	public async view(user: User | null, post: Post) {
    if (post.userId === user?.id) {
      return true
    }

    if (!post.isPublished) {
      return Bouncer.deny('This post is not yet published', 404)
    }

    return true
  }

  public async create(user: User) {
    return user.roleId === Role.EDITOR
  }

  public async update(user: User, post: Post) {
    return post.userId === user.id
  }

  public async delete(user: User, post: Post) {
    return post.userId === user.id
  }
}
