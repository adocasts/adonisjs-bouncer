import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from "App/Models/Post";
import PostValidator from "App/Validators/PostValidator";

export default class PostsController {
  public async index({ view, bouncer }: HttpContextContract) {
    await bouncer.with('PostPolicy').authorize('viewList')

    const posts = await Post.query()
      .preload('user')
      .where('isPublished', true)

    return view.render('index', { posts })
  }

  public async create({ view, bouncer }: HttpContextContract) {
    await bouncer.with('PostPolicy').authorize('create')

    return view.render('posts/createOrEdit')
  }

  public async store({ request, response, auth, bouncer }: HttpContextContract) {
    await bouncer.with('PostPolicy').authorize('create')

    const data = await request.validate(PostValidator)

    const post = await Post.create({
      ...data,
      userId: auth.user!.id
    })

    return response.redirect().toRoute('posts.show', { id: post.id })
  }

  public async show({ view, params, bouncer }: HttpContextContract) {
    const post = await Post.query()
      .preload('user')
      .where('id', params.id)
      .firstOrFail()

    if (await bouncer.with('CommentPolicy').allows('viewList', post)) {
      await post.load('comments', query => query.preload('user'))
    }

    await bouncer.with('PostPolicy').authorize('view', post)

    return view.render('posts/show', { post })
  }

  public async edit({ view, params, bouncer }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    await bouncer.with('PostPolicy').authorize('update', post)

    return view.render('posts/createOrEdit', { post })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    await bouncer.with('PostPolicy').authorize('update', post)

    const data = await request.validate(PostValidator)

    await post.merge(data).save()

    return response.redirect().toRoute('posts.show', { id: post.id })
  }

  public async destroy({ response, params, bouncer }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    await bouncer.with('PostPolicy').authorize('delete', post)

    await post.related('comments').query().delete()
    await post.delete()

    return response.redirect().toRoute('home')
  }
}
