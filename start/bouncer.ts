/**
 * Contract source: https://git.io/Jte3T
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import User from "App/Models/User";
import Role from "Contracts/enums/Role";
import Post from "App/Models/Post";
import Logger from "@ioc:Adonis/Core/Logger"
import Comment from "App/Models/Comment";

/*
|--------------------------------------------------------------------------
| Bouncer Actions
|--------------------------------------------------------------------------
|
| Actions allows you to separate your application business logic from the
| authorization logic. Feel free to make use of policies when you find
| yourself creating too many actions
|
| You can define an action using the `.define` method on the Bouncer object
| as shown in the following example
|
| ```
| 	Bouncer.define('deletePost', (user: User, post: Post) => {
|			return post.user_id === user.id
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "actions" const from this file
|****************************************************************
*/

export const { actions } = Bouncer
  .before((user: User | null) => {
    if (user?.roleId === Role.ADMIN) {
      return true
    }
  })
  .after((user: User | null, actionName, actionResult) => {
    const userType = user ? 'User' : 'Guest'

    actionResult.authorized
      ? Logger.info(`${userType} was authorized to ${actionName}`)
      : Logger.info(`${userType} was denied to ${actionName} for ${actionResult.errorResponse}`)
  })

  /* POST
  /***************************************/
  .define('createPost', (user: User) => {
    return user.roleId === Role.EDITOR
  })
  .define('viewPost', (user: User | null, post: Post) => {
    if (post.userId === user?.id) {
      return true
    }

    if (!post.isPublished) {
      return Bouncer.deny('This post is not yet published', 404)
    }

    return true
  }, { allowGuest: true })
  .define('editPost', (user: User, post: Post) => {
    return post.userId === user.id
  })
  .define('destroyPost', (user: User, post: Post) => {
    return post.userId === user.id
  })

  /* COMMENT
  /***************************************/
  .define('viewCommentList', (user: User | null, post: Post) => {
    return post.isPublished
  }, { allowGuest: true })
  .define('createComment', (user: User, post: Post) => {
    return post.isPublished
  })
  .define('editComment', (user: User, comment: Comment) => {
    return comment.userId === user.id
  })
  .define('destroyComment', (user: User, comment: Comment) => {
    const allowedRoles = [Role.MODERATOR, Role.EDITOR, Role.ADMIN]

    return comment.userId === user.id || allowedRoles.includes(user.roleId)
  })

/*
|--------------------------------------------------------------------------
| Bouncer Policies
|--------------------------------------------------------------------------
|
| Policies are self contained actions for a given resource. For example: You
| can create a policy for a "User" resource, one policy for a "Post" resource
| and so on.
|
| The "registerPolicies" accepts a unique policy name and a function to lazy
| import the policy
|
| ```
| 	Bouncer.registerPolicies({
|			UserPolicy: () => import('App/Policies/User'),
| 		PostPolicy: () => import('App/Policies/Post')
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "policies" const from this file
|****************************************************************
*/
export const { policies } = Bouncer.registerPolicies({})
