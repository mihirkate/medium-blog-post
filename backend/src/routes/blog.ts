import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables: {
        userId: string;
    }
}>()


blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
        console.log(user);

        if (user) {
            c.set("userId", user.id);
            await next();
        } else {
            c.status(403);
            return c.json({
                message: "You are not logged in"
            })
        }
    } catch (e) {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
});


blogRouter.post('/', async (c) => {

    // initialise prisma first 
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const body = await c.req.json();
        const userId = c.get("userId");
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId
            }
        })
        return c.json({

            id: post.id,
            message: "Blog post created successfully"
        })
    }
    catch (error) {
        console.error("Error creating blog post:", error);
        c.status(500);
        return c.json({
            error: "Failed to create blog post"
        });
    }
});

blogRouter.put('/', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const blog = await prisma.post.update({
        where: {
            id: body.id,
        },
        data: {
            title: body.title,
            content: body.content,

        }
    })

    return c.json({

        id: blog.id,
        msg: "Updated content ",
    })

})


blogRouter.get('/bulk', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blogs = await prisma.post.findMany({
        select: {
            content: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });



    return c.json({
        blogs
    })
})

blogRouter.get('/:id', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = await c.req.param("id");
    try {
        const blog = await prisma.post.findFirst({
            where: {
                id: id,
            },
            select: {
                id: true,
                title: true,
                content: true,

                author: {
                    select: { name: true },
                }
            }
        })

        return c.json({
            blog
        })
    } catch (error) {
        console.log(error);
        return c.json({
            msg: "error  while fetching the blog post "
        })
    }

})
