import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { signupInput } from "@mihirkate/medium-common"
export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    }
}>()


userRouter.post("/signup", async (c) => {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    console.log(success);

    if (!success) {
        c.status(411);
        return c.json({
            msg: "wrong inputs"
        })
    }
    console.log("succes:", success);

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())


    try {


        // Hash the password
        const encoder = new TextEncoder();
        const data = encoder.encode(body.password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const user = await prisma.user.create({
            data: {
                username: body.username,
                password: hashedPassword,
                name: body.name
            }
        })

        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({
            msg: "signed Up ",
            jwt
        });
    }
    catch (e) {
        console.log(e);
        c.status(411);
        return c.text('Invalid')
    }
})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();


    // Hash the incoming password
    const encoder = new TextEncoder();
    const data = encoder.encode(body.password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');


    const user = await prisma.user.findFirst({
        where: {
            username: body.username,
            password: hashedPassword,
        }
    });

    if (!user) {
        c.status(403);
        return c.json({ error: "user not found" });
    }


    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
})


