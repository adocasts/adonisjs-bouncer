import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from "App/Models/Comment";
import CommentValidator from "App/Validators/CommentValidator";
import Post from "App/Models/Post";


export default class CommentsController {
  public async store({ request, response, auth, params, bouncer }: HttpContextContract) {
    const post = await Post.findOrFail(params.post_id)

    await bouncer.with('CommentPolicy').authorize('create', post)

    const data = await request.validate(CommentValidator)

    await Comment.create({
      ...data,
      userId: auth.user!.id,
      postId: params.post_id
    })

    return response.redirect().toRoute('posts.show', { id: params.post_id })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    const comment = await Comment.findOrFail(params.id)

    await bouncer.with('CommentPolicy').authorize('update', comment)

    const data = await request.validate(CommentValidator)

    await comment.merge(data).save()

    return response.redirect().toRoute('posts.show', { id: comment.postId })
  }

  public async destroy({ response, params, bouncer }: HttpContextContract) {
    const comment = await Comment.findOrFail(params.id)

    await bouncer.with('CommentPolicy').authorize('delete', comment)

    await comment.delete()

    return response.redirect().toRoute('posts.show', { id: comment.postId })
  }
}
