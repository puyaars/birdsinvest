import session from 'express-session'
import redisStore from 'connect-redis'
import redis from 'redis'


const RedisStore = redisStore(session)

const redisClient = redis.createClient({
    url: process.env.REDIS_URL_SESSION
})

export default new RedisStore({ client: redisClient });