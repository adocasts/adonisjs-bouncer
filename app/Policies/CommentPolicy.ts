import {action} from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Comment from 'App/Models/Comment'
import Post from "App/Models/Post";
import Role from "Contracts/enums/Role";
import BasePolicy from "App/Policies/BasePolicy";

export default class CommentPolicy extends BasePolicy {
  @action({ allowGuest: true })
	public async viewList(_: User, post: Post) {
    return post.isPublished
  }

	public async create(_: User, post: Post) {
    return post.isPublished
  }

  public async update(user: User, comment: Comment) {
    return comment.userId === user.id
  }

  public async delete(user: User, comment: Comment) {
    const allowedRoles = [Role.MODERATOR, Role.EDITOR, Role.ADMIN]

    return comment.userId === user.id || allowedRoles.includes(user.roleId)
  }
}
