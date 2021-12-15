import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from "App/Models/Comment";
import CommentValidator from "App/Validators/CommentValidator";


export default class CommentsController {
  public async store({ request, response, auth, params }: HttpContextContract) {
    const data = await request.validate(CommentValidator)

    await Comment.create({
      ...data,
      userId: auth.user!.id,
      postId: params.post_id
    })

    return response.redirect().toRoute('posts.show', { id: params.post_id })
  }

  public async update({ request, response, params }: HttpContextContract) {
    const comment = await Comment.findOrFail(params.id)
    const data = await request.validate(CommentValidator)

    await comment.merge(data).save()

    return response.redirect().toRoute('posts.show', { id: comment.postId })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const comment = await Comment.findOrFail(params.id)

    await comment.delete()

    return response.redirect().toRoute('posts.show', { id: comment.postId })
  }
}
