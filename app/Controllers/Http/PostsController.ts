import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from "App/Models/Post";
import PostValidator from "App/Validators/PostValidator";

export default class PostsController {
  public async index({ view }: HttpContextContract) {
    const posts = await Post.query().preload('user')
    return view.render('index', { posts })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('posts/createOrEdit')
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(PostValidator)

    const post = await Post.create({
      ...data,
      userId: auth.user!.id
    })

    return response.redirect().toRoute('posts.show', { id: post.id })
  }

  public async show({ view, params }: HttpContextContract) {
    const post = await Post.query()
      .preload('comments', query => query.preload('user'))
      .preload('user')
      .where('id', params.id)
      .firstOrFail()

    return view.render('posts/show', { post })
  }

  public async edit({ view, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)
    return view.render('posts/createOrEdit', { post })
  }

  public async update({ request, response, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)
    const data = await request.validate(PostValidator)

    await post.merge(data).save()

    return response.redirect().toRoute('posts.show', { id: post.id })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    await post.related('comments').query().delete()
    await post.delete()

    return response.redirect().toRoute('home')
  }
}
